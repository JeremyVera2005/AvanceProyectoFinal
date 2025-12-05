package com.quantika.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret; // Clave del application.properties

    public String generarToken(Map<String, Object> claims) {
        // ✅ Genera una clave válida a partir del secreto (mínimo 32 caracteres)
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        // ✅ Construcción del token JWT válido por 1 día
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
