package com.quantika.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("✅ Backend iniciado correctamente en: http://localhost:5000");
		System.out.println("📦 API base disponible en: http://localhost:5000/api");
	}
}
