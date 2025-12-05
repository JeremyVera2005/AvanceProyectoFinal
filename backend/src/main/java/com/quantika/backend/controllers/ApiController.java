package com.quantika.backend.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping
    public String home() {
        return "✅ API Quantika Backend funcionando correctamente";
    }

    @GetMapping("/saludo")
    public String saludo() {
        return "👋 Hola desde el backend de Quantika!";
    }
}
