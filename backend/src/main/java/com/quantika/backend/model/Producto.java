package com.quantika.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    private String categoria; // ✔ NUEVO

    private String proveedor1;
    private String proveedor2;

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategoria() { // ✔ GET
        return categoria;
    }

    public void setCategoria(String categoria) { // ✔ SET
        this.categoria = categoria;
    }

    public String getProveedor1() {
        return proveedor1;
    }

    public void setProveedor1(String proveedor1) {
        this.proveedor1 = proveedor1;
    }

    public String getProveedor2() {
        return proveedor2;
    }

    public void setProveedor2(String proveedor2) {
        this.proveedor2 = proveedor2;
    }
}
