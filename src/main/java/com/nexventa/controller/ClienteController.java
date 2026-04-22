package com.nexventa.controller;

import com.nexventa.model.Cliente;
import com.nexventa.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/*
* Recibe las peticiones http y devuelve respuestas en JSON
* */
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service){
        this.service = service;
    }

    @GetMapping         // Get /clientes lista los clientes
    public List<Cliente> listar(){
        return service.listarClientes();
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String nombre){

        String respuesta = "Cliente no encontrado";
        if (id != null){
            Cliente cliente = service.obtenerCliente(id);
            return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        }
        if (telefono != null){
            Cliente cliente = service.obtenerPorTelefono(telefono);
            return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        }
        if (nombre != null){
            List<Cliente> cliente = service.obtenerPorNombre(nombre);
            return cliente.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta) : ResponseEntity.ok(cliente);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Debes proporcionar un id o telefono o nombre");
    }

    @PostMapping        // Post /clientes guarda un cliente
    public ResponseEntity<?> guardar(@RequestBody Cliente cliente){
        try {
            Cliente nuevo = service.guardarCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
