package com.quantika.backend.repository;

import com.quantika.backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    boolean existsByNombre(String nombre);

}
