package com.quantika.backend.controllers;

import com.quantika.backend.model.Producto;
import com.quantika.backend.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Producto producto) {
        Producto nuevo = productoRepository.save(producto);
        return ResponseEntity.ok(Map.of(
                "message", "Producto creado correctamente",
                "data", nuevo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        return productoRepository.findById(id)
                .map(p -> {
                    if (producto.getNombre() != null)
                        p.setNombre(producto.getNombre());
                    if (producto.getDescripcion() != null)
                        p.setDescripcion(producto.getDescripcion());
                    if (producto.getPrecio() != null)
                        p.setPrecio(producto.getPrecio());
                    if (producto.getStock() != null)
                        p.setStock(producto.getStock());
                    if (producto.getCategoria() != null)
                        p.setCategoria(producto.getCategoria()); // ✔ NUEVO
                    if (producto.getProveedor1() != null)
                        p.setProveedor1(producto.getProveedor1());
                    if (producto.getProveedor2() != null)
                        p.setProveedor2(producto.getProveedor2());

                    return ResponseEntity.ok(productoRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
