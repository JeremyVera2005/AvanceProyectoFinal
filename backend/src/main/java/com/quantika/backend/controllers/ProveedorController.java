package com.quantika.backend.controllers;

import com.quantika.backend.model.Proveedor;
import com.quantika.backend.repository.ProveedorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public List<Proveedor> listar() {
        return proveedorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Proveedor proveedor) {
        Proveedor nuevo = proveedorRepository.save(proveedor);
        return ResponseEntity.ok(Map.of("message", "Proveedor registrado correctamente", "data", nuevo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        return proveedorRepository.findById(id)
                .map(p -> {
                    if (proveedor.getNombre() != null)
                        p.setNombre(proveedor.getNombre());
                    if (proveedor.getContacto() != null)
                        p.setContacto(proveedor.getContacto());
                    if (proveedor.getTelefono() != null)
                        p.setTelefono(proveedor.getTelefono());
                    return ResponseEntity.ok(proveedorRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!proveedorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        proveedorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
