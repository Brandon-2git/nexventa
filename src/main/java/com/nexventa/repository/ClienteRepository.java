package com.nexventa.repository;

import com.nexventa.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/*
*  Repository - Comunicación con la base de datos
* */
public interface ClienteRepository extends JpaRepository <Cliente, Long> {
    Optional<Cliente> findByTelefono(String telefono);
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
}
