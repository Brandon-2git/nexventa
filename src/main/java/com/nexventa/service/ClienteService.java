package com.nexventa.service;

import com.nexventa.model.Cliente;
import com.nexventa.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository){
        this.repository = repository;
    }

    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    public Cliente obtenerCliente(Long id){
        return repository.findById(id).orElse(null);
    }

    public Cliente obtenerPorTelefono(String telefono) {
        return repository.findByTelefono(telefono).orElse(null);
    }

    public List<Cliente> obtenerPorNombre(String nombre){
        return repository.findByNombreContainingIgnoreCase(nombre);
    }

    public Cliente guardarCliente(Cliente cliente){
        Optional<Cliente> existente = repository.findByTelefono(cliente.getTelefono());
        if (existente.isPresent()){
            throw new RuntimeException("Ya existe un cliente con ese teléfono");
        }
        return repository.save(cliente);
    }

}
