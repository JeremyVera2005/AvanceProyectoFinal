package com.quantika.backend.service;

import com.quantika.backend.model.User;
import com.quantika.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder; // ✅ en uso correcto

    public UserService(UserRepository userRepo, BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepo.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepo.findById(id);
    }

    @Transactional
    public User create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // 🔒 encripta
        return userRepo.save(user);
    }

    @Transactional
    public User update(Long id, User nuevo) {
        User existente = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existente.setNombre(nuevo.getNombre());
        existente.setApellido(nuevo.getApellido());
        existente.setEmail(nuevo.getEmail());
        existente.setRol(nuevo.getRol());

        if (nuevo.getPassword() != null && !nuevo.getPassword().isBlank()) {
            existente.setPassword(passwordEncoder.encode(nuevo.getPassword()));
        }

        return userRepo.save(existente);
    }

    @Transactional
    public void delete(Long id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepo.delete(u);
    }
}
