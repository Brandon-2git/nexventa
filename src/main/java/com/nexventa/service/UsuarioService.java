package com.nexventa.service;


import com.nexventa.model.Usuario;
import com.nexventa.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository){
        this.repository = repository;
    }

    public List<Usuario> listaUsuarios(){
        return repository.findAll();
    }

    public Usuario obtenerUsuario(Long id){
        return repository.findById(id).orElse(null);
    }

    public Usuario guardarUsuario(Usuario usuario){
        Optional<Usuario> existente = repository.findByCorreo(usuario.getCorreo());
        if (existente.isPresent()){
            throw new RuntimeException("Ya existe un usuario con ese correo");
        }
        return repository.save(usuario);
    }

    public Usuario login(String identificador, String contrasena){
        Optional<Usuario> usuario = repository.findByCorreo(identificador);
        if (!usuario.isPresent()) {
            usuario = repository.findByTelefono(identificador);
        }

        if (usuario.isPresent() && usuario.get().getContrasena().equals(contrasena)){
            return usuario.get();
        }
        throw new RuntimeException("Credenciales incorrectas");
    }

}
