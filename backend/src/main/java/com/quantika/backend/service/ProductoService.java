package com.quantika.backend.service;

import com.quantika.backend.model.Producto;
import com.quantika.backend.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepo;

    public ProductoService(ProductoRepository productoRepo) {
        this.productoRepo = productoRepo;
    }

    public List<Producto> findAll() {
        return productoRepo.findAll();
    }

    public Optional<Producto> findById(Long id) {
        return productoRepo.findById(id);
    }

    public Optional<Producto> findByNombre(String nombre) {
        return productoRepo.findByNombre(nombre);
    }

    @Transactional
    public Producto create(Producto p) {
        return productoRepo.save(p);
    }

    @Transactional
    public Producto update(Long id, Producto p) {
        Producto existente = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setNombre(p.getNombre());
        existente.setDescripcion(p.getDescripcion());
        existente.setPrecio(p.getPrecio());
        existente.setStock(p.getStock());
        existente.setCategoria(p.getCategoria()); // ✔ NUEVO
        existente.setProveedor1(p.getProveedor1());
        existente.setProveedor2(p.getProveedor2());

        return productoRepo.save(existente);
    }

    @Transactional
    public void delete(Long id) {
        Producto p = productoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        productoRepo.delete(p);
    }
}
