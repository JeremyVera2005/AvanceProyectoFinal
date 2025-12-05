package com.quantika.backend.controllers;

import com.quantika.backend.model.Movimiento;
import com.quantika.backend.service.MovimientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin(origins = "*")
public class MovimientoController {

    private final MovimientoService movimientoService;

    public MovimientoController(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }

    /** 🔹 Listar movimientos con detalle y proveedor */
    @GetMapping
    public List<Map<String, Object>> listar() {
        return movimientoService.getMovimientosConStock();
    }

    /** 🔹 Registrar nuevo movimiento (con proveedor si es ingreso) */
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Movimiento movimiento) {
        try {
            Movimiento nuevo = movimientoService.registrarMovimiento(movimiento);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** 🔹 Actualizar movimiento existente */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Movimiento movimiento) {
        try {
            Movimiento actualizado = movimientoService.updateMovimiento(id, movimiento);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** 🔹 Eliminar movimiento */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            movimientoService.deleteMovimiento(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
