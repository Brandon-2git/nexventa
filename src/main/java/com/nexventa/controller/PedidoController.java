package com.nexventa.controller;

import com.nexventa.model.Pedido;
import com.nexventa.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService){
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listar(){
        return pedidoService.listar();
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
        @RequestParam(required = false) Long id,
        @RequestParam(required = false) Long clienteId,
        @RequestParam(required = false) Pedido.Estado estado
    ){
        String respuesta = "Pedido no encontrado";
        if (id != null){
            Pedido pedido = pedidoService.obtener(id);
            return pedido != null
                    ? ResponseEntity.ok(pedido)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        }
        if (clienteId != null){
            List<Pedido> pedidos = pedidoService.obtenerPorCliente(clienteId);
            return pedidos.isEmpty()
                    ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta)
                    : ResponseEntity.ok(pedidos);
        }
        if (estado != null){
            List<Pedido> pedidos = pedidoService.obtenerPorEstado(estado);
            return pedidos.isEmpty()
                    ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta)
                    : ResponseEntity.ok(pedidos);
        }
        return ResponseEntity.badRequest().body("Debes enviar al menos un parámetro");
    }
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Pedido pedido){
        try {
            Pedido nuevo = pedidoService.crearPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
