package org.nicktech.controller;

import org.nicktech.model.User;
import org.nicktech.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> users(@RequestHeader(value = "Authorization", required = false) String authorization) {
        User admin = findAdmin(authorization);
        if (admin == null) {
            return unauthorizedResponse();
        }

        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(user -> Map.<String, Object>of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole()
            ))
            .toList();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(
        @RequestHeader(value = "Authorization", required = false) String authorization,
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        User admin = findAdmin(authorization);
        if (admin == null) {
            return unauthorizedResponse();
        }

        User user = userRepository.findById(id).orElse(null);
        String role = body.get("role");
        if (user == null || (!"USER".equals(role) && !"ADMIN".equals(role))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Utilisateur ou rôle invalide."));
        }
        if (admin.getId().equals(user.getId()) && !"ADMIN".equals(role)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vous ne pouvez pas retirer votre propre rôle admin."));
        }

        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Rôle mis à jour."));
    }

    private User findAdmin(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer NICKTECH-SESSION-")) {
            return null;
        }
        try {
            Long userId = Long.valueOf(authorization.substring("Bearer NICKTECH-SESSION-".length()));
            User user = userRepository.findById(userId).orElse(null);
            return user != null && "ADMIN".equals(user.getRole()) ? user : null;
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private ResponseEntity<Map<String, String>> unauthorizedResponse() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("message", "Accès réservé aux administrateurs."));
    }
}
