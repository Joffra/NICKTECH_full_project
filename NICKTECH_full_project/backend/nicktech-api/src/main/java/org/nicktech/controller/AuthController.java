package org.nicktech.controller;
import org.nicktech.model.User;
import org.nicktech.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final UserRepository repo;
 public AuthController(UserRepository repo){this.repo=repo;}

 @PostMapping("/register")
 public User register(@RequestBody User user){
   user.setRole(repo.count() == 0 ? "ADMIN" : "USER");
   return repo.save(user);
 }

 @PostMapping("/login")
 public ResponseEntity<?> login(@RequestBody Map<String,String> body){
   String email = body.get("email");
   String password = body.get("password");
   User user = email == null ? null : repo.findByEmail(email.trim()).orElse(null);

   if(user == null || password == null || !password.equals(user.getPassword())){
     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
         .body(Map.of("message", "Email ou mot de passe incorrect."));
   }

   return ResponseEntity.ok(Map.of(
       "token", "NICKTECH-SESSION-" + user.getId(),
       "name", user.getName(),
       "role", user.getRole()
   ));
 }
}