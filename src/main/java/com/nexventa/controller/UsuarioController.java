package com.nexventa.controller;


import com.nexventa.model.Usuario;
import com.nexventa.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service){
        this.service = service;
    }

    // Obtiene todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listar(){
        return ResponseEntity.ok(service.listaUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id){
        Usuario usuario = service.obtenerUsuario(id);
        if(usuario != null){
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario){
        try{
            Usuario nuevo = service.guardarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    static class LoginRequest{
        public String identificador;
        public String contrasena;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try{
            Usuario usuario = service.login(request.identificador, request.contrasena);
            return ResponseEntity.ok(usuario);
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    //actualiza los datos de usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario usuario){
        try {
            Usuario actualizado = service.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(actualizado);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //Desactiva un usuario sin eliminarlo
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id){
        try {
            return ResponseEntity.ok(service.desactivarUsuario(id));
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //Activa un usuario que estaba inactivo
    @PutMapping("/{id}/activar")
    public ResponseEntity<?> activar(@PathVariable Long id){
        try {
            return ResponseEntity.ok(service.activarUsuario(id));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
