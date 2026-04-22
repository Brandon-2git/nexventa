package com.nexventa.service;

import com.nexventa.model.Producto;
import com.nexventa.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository){
        this.repository = repository;
    }

    public List<Producto> listar(){
        return repository.findAll();
    }

    public Producto guardar(Producto producto){
        return repository.save(producto);
    }

    public Producto obtener(Long id){
        return repository.findById(id).orElse(null);
    }

    public List<Producto> obtenerPorNombre(String nombre){
        return repository.findByNombreContainingIgnoreCase(nombre);
    }
}
