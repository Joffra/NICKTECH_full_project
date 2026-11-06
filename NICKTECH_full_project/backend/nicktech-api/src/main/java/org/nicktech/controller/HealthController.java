package org.nicktech.controller;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api")
public class HealthController {
 @GetMapping("/health") public String health(){return "NICKTECH API OK";}
}