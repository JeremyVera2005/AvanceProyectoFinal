package com.quantika.backend.controllers;

import com.quantika.backend.model.User;
import com.quantika.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // 🔹 Obtener todos los usuarios
    @GetMapping
    public List<User> listar() {
        return userRepository.findAll();
    }

    // 🔹 Crear usuario nuevo
    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@RequestBody User usuario) {
        if (usuario.getEmail() == null || usuario.getPassword() == null || usuario.getEmail().isBlank()
                || usuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email y contraseña son obligatorios"));
        }

        if (userRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        User nuevo = userRepository.save(usuario);

        return ResponseEntity.ok(Map.of(
                "message", "✅ Usuario creado exitosamente",
                "user", nuevo));
    }

    // 🔹 Actualizar usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody User usuario) {
        return userRepository.findById(id)
                .map(u -> {
                    // Actualizar nombre y apellido si vienen
                    if (usuario.getNombre() != null)
                        u.setNombre(usuario.getNombre());
                    if (usuario.getApellido() != null)
                        u.setApellido(usuario.getApellido());

                    // Validar email duplicado solo si cambia
                    if (usuario.getEmail() != null && !usuario.getEmail().equals(u.getEmail())) {
                        if (userRepository.findByEmail(usuario.getEmail()).isPresent()) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("error", "El correo ya está registrado por otro usuario"));
                        }
                        u.setEmail(usuario.getEmail());
                    }

                    // Actualizar rol si viene
                    if (usuario.getRol() != null)
                        u.setRol(usuario.getRol());

                    // Actualizar contraseña solo si viene y no está vacía
                    if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
                        u.setPassword(passwordEncoder.encode(usuario.getPassword()));
                    }

                    User actualizado = userRepository.save(u);
                    return ResponseEntity.ok(Map.of(
                            "message", "✏️ Usuario actualizado correctamente",
                            "user", actualizado));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "🗑️ Usuario eliminado correctamente"));
    }
}
