package com.nexventa.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/*
* Model - Representa la tabla clientes en la base de datos
* cada campo es una columna de la tabla
* */
@Entity //Esta clase es una tabla en la BD
@Table(name = "clientes") //Nombre de la tabla
public class Cliente {
    @Id                   //Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Id autoincremental

    private Long id;
    private String nombre;
    @Column(unique = true)
    private String telefono;
    private String direccion;
    private String colonia;
    private String ciudad;

    private boolean activo = true;
    @Column(name = "created_at") // En la BD se llama Created_at
    private LocalDateTime createdAt;

    //Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }
}
