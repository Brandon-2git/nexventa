package com.nexventa.controller;

import com.nexventa.model.Producto;
import com.nexventa.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {
    private final ProductoService service;

    public ProductoController(ProductoService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listar(){
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String nombre){
        String respuesta = "Producto no encontrado";

        if (id != null){
            Producto producto = service.obtener(id);
            return producto != null ? ResponseEntity.ok(producto) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);

        }
        if (nombre != null){
            List<Producto> producto = service.obtenerPorNombre(nombre);
            return producto.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta) : ResponseEntity.ok(producto);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Debes proporcionar un id o nombre");
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Producto producto){
        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(producto));
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
