package com.quantika.backend.service;

import com.quantika.backend.model.Proveedor;
import com.quantika.backend.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepo;

    public ProveedorService(ProveedorRepository proveedorRepo) {
        this.proveedorRepo = proveedorRepo;
    }

    public List<Proveedor> findAll() {
        return proveedorRepo.findAll();
    }

    public Optional<Proveedor> findById(Long id) {
        return proveedorRepo.findById(id);
    }

    @Transactional
    public Proveedor create(Proveedor p) {
        return proveedorRepo.save(p);
    }

    @Transactional
    public Proveedor update(Long id, Proveedor p) {
        Proveedor existente = proveedorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        existente.setNombre(p.getNombre());
        existente.setContacto(p.getContacto());
        existente.setTelefono(p.getTelefono());

        return proveedorRepo.save(existente);
    }

    @Transactional
    public void delete(Long id) {
        Proveedor p = proveedorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        proveedorRepo.delete(p);
    }
}
