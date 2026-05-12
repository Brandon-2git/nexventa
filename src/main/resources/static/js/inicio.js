/**
 * @file inicio.js
 * @description
 * Este documento se encarga de:
 *  - Mostrar el saludo con el nombre del usuario en la barra superior
 *  - Mostrar la fecha actual formateada
 *  - Consultar al backend los totales de clientes, productos, usuarios y pedidos
 *  - Actualizar dichos totales en el dashboard
 */

/**
 * Muestra un saludo personalizado en la topbar usando el nombre del usuario
 */
document.getElementById('topbar-saludo').textContent = 'Bienvenido, ' + usuario.nombre;

/**
 * Obtiene la fehca actual y la formatea en español (mx)
 * incluyendo día de la semana, día, mes ya año
 */
const fecha = new Date();
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('topbar-fecha').textContent = fecha.toLocaleDateString('es-MX', opciones);

// Consultas al backend
const BASE_URL = window.location.origin;

/**
 *  Consulta la lista de clientes al backend y muestra el total en el dashboard
 */
fetch(BASE_URL + '/clientes')
    .then(r => r.json())
    .then(data => {
        document.getElementById('total-clientes').textContent = data.length;
    });

/**
 *  Consulta la lista de productos al backend y muestra el total en el dashboard 
 */
fetch(BASE_URL + '/productos')
    .then(r => r.json())
    .then(data => {
        document.getElementById('total-productos').textContent = data.length;
    });

/**
 *  Consulta la lista de usuarios al backend y muestra el total en el dashboard
 */
fetch(BASE_URL + '/usuarios')
    .then(r => r.json())
    .then(data => {
        document.getElementById('total-usuarios').textContent = data.length;
    });

/**
 *  Consulta la lista de pedidos al backend y muestra el total en el dashboard
 */
fetch(BASE_URL + '/pedidos')
    .then(r => r.json())
    .then(data => {
        document.getElementById('total-pedidos').textContent = data.length;
    });