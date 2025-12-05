package com.quantika.backend.repository;

import com.quantika.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findByNombre(String nombre);

    // Opcionales: buscar por proveedor1 o proveedor2
    List<Producto> findByProveedor1(String proveedor1);

    List<Producto> findByProveedor2(String proveedor2);
}
