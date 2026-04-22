package com.nexventa.repository;

import com.nexventa.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteId(Long clientId);
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByEstado(Pedido.Estado estado);
}
