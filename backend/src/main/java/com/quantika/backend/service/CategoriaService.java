package com.quantika.backend.service;

import com.quantika.backend.model.Categoria;
import com.quantika.backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository repo;

    public CategoriaService(CategoriaRepository repo) {
        this.repo = repo;
    }

    public List<Categoria> findAll() {
        return repo.findAll();
    }

    public Categoria findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Transactional
    public Categoria create(Categoria c) {
        return repo.save(c);
    }

    @Transactional
    public Categoria update(Integer id, Categoria c) {
        Categoria existente = findById(id);

        existente.setNombre(c.getNombre());
        existente.setDescripcion(c.getDescripcion());
        existente.setEstado(c.getEstado());

        return repo.save(existente);
    }

    @Transactional
    public void delete(Integer id) {
        Categoria existente = findById(id);
        repo.delete(existente);
    }
}
