package com.nexventa.service;

import com.nexventa.model.Pedido;
import com.nexventa.model.PedidoDetalle;
import com.nexventa.model.Producto;
import com.nexventa.repository.PedidoRepository;
import com.nexventa.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository){
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
    }

    public List<Pedido> listar(){
        return pedidoRepository.findAll();
    }

    public Pedido obtener(Long id){
        return pedidoRepository.findById(id).orElse(null);
    }

    public List<Pedido> obtenerPorCliente(Long clienteId){
        return pedidoRepository.findByClienteId(clienteId);
    }

    public List<Pedido> obtenerPorEstado(Pedido.Estado estado){
        return pedidoRepository.findByEstado(estado);
    }

    public Pedido crearPedido(Pedido pedido){

        //Se itera por cada detalle para calcular su subtotal y descuent stock
        for (PedidoDetalle detalle: pedido.getDetalles()){

            //Toma el precio del catalogo si no viene precio
            if (detalle.getPrecioUnitario() == null){
                Producto producto = productoRepository.findById(
                        detalle.getProducto().getId()
                ).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                detalle.setPrecioUnitario(producto.getPrecio());
            }

            //Se calcula el subtotal
            detalle.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());

            //se liga el detalle al pedido
            detalle.setPedido(pedido);
        }
        //Se calcula el total sumando todos los subtotales
        Double total = pedido.getDetalles().stream()
                .mapToDouble(PedidoDetalle::getSubtotal).sum();
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

}
