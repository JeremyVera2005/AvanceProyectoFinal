package com.quantika.backend.service;

import com.quantika.backend.model.Movimiento;
import com.quantika.backend.model.Producto;
import com.quantika.backend.repository.MovimientoRepository;
import com.quantika.backend.repository.ProductoRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class MovimientoService {

    private final MovimientoRepository movRepo;
    private final ProductoRepository prodRepo;
    private final JdbcTemplate jdbc;

    public MovimientoService(MovimientoRepository movRepo, ProductoRepository prodRepo, JdbcTemplate jdbc) {
        this.movRepo = movRepo;
        this.prodRepo = prodRepo;
        this.jdbc = jdbc;
    }

    /** 🔹 Devuelve todos los movimientos con stock y proveedor */
    public List<Map<String, Object>> getMovimientosConStock() {
        String sql = """
                SELECT m.id, m.producto_nombre, m.tipo, m.cantidad, m.fecha, m.detalle, m.proveedor, p.stock
                FROM movimientos m
                LEFT JOIN productos p ON m.producto_nombre = p.nombre
                ORDER BY m.fecha DESC
                """;
        return jdbc.queryForList(sql);
    }

    /** 🔹 Registrar un nuevo movimiento y actualizar stock */
    @Transactional
    public Movimiento registrarMovimiento(Movimiento movimiento) {
        if (movimiento.getTipo() == null) {
            throw new IllegalArgumentException("El tipo debe ser 'Ingreso' o 'Salida'");
        }

        Producto producto = prodRepo.findByNombre(movimiento.getProductoNombre())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stockActual = producto.getStock() == null ? 0 : producto.getStock();

        // Ajustar stock según tipo
        switch (movimiento.getTipo()) {
            case Ingreso -> producto.setStock(stockActual + movimiento.getCantidad());
            case Salida -> {
                if (stockActual < movimiento.getCantidad()) {
                    throw new IllegalArgumentException("Stock insuficiente para realizar la salida");
                }
                producto.setStock(stockActual - movimiento.getCantidad());
                movimiento.setProveedor(null); // En salidas no hay proveedor
            }
        }

        prodRepo.save(producto);
        return movRepo.save(movimiento);
    }

    /** 🔹 Actualiza un movimiento existente y ajusta el stock */
    @Transactional
    public Movimiento updateMovimiento(Long id, Movimiento actualizado) {
        Movimiento original = movRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        Producto prodOriginal = prodRepo.findByNombre(original.getProductoNombre())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stockOriginal = prodOriginal.getStock() == null ? 0 : prodOriginal.getStock();

        // Revertir efecto anterior
        if (original.getTipo() == Movimiento.Tipo.Ingreso) {
            prodOriginal.setStock(stockOriginal - original.getCantidad());
        } else {
            prodOriginal.setStock(stockOriginal + original.getCantidad());
        }
        prodRepo.save(prodOriginal);

        // Actualizar datos del movimiento
        original.setProductoNombre(actualizado.getProductoNombre());
        original.setTipo(actualizado.getTipo());
        original.setCantidad(actualizado.getCantidad());
        original.setDetalle(actualizado.getDetalle());
        original.setProveedor(actualizado.getTipo() == Movimiento.Tipo.Ingreso ? actualizado.getProveedor() : null);

        movRepo.save(original);

        // Aplicar efecto nuevo en stock
        Producto prodNuevo = prodRepo.findByNombre(actualizado.getProductoNombre())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stockNuevo = prodNuevo.getStock() == null ? 0 : prodNuevo.getStock();

        if (actualizado.getTipo() == Movimiento.Tipo.Ingreso) {
            prodNuevo.setStock(stockNuevo + actualizado.getCantidad());
        } else {
            if (stockNuevo < actualizado.getCantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para realizar la salida");
            }
            prodNuevo.setStock(stockNuevo - actualizado.getCantidad());
        }

        prodRepo.save(prodNuevo);
        return original;
    }

    /** 🔹 Elimina un movimiento y revierte su efecto en el stock */
    @Transactional
    public void deleteMovimiento(Long id) {
        Movimiento movimiento = movRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        Producto producto = prodRepo.findByNombre(movimiento.getProductoNombre())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        int stock = producto.getStock() == null ? 0 : producto.getStock();

        if (movimiento.getTipo() == Movimiento.Tipo.Ingreso) {
            producto.setStock(stock - movimiento.getCantidad());
        } else {
            producto.setStock(stock + movimiento.getCantidad());
        }

        prodRepo.save(producto);
        movRepo.delete(movimiento);
    }
}
