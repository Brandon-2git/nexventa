/**
 *  @description Gestion de clientes del sistema nexventa
 */

const BASE_URL = window.location.origin;

// Referencias al DOM
const tablaClientes = document.getElementById('tabla-clientes');
const inputNombre = document.getElementById('input-buscar-nombre');
const inputTelefono = document.getElementById('input-buscar-telefono');
const selectTipo = document.getElementById('select-tipo'); // ← cambia a tipo

let clientes = [];

function cargarClientes() {
    fetch(BASE_URL + '/clientes')
        .then(r => r.json())
        .then(data => {
            clientes = data;
            renderizarTabla(clientes);
        });
}

function renderizarTabla(lista) {
    tablaClientes.innerHTML = '';

    if (lista.length === 0) {
        tablaClientes.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:#999; padding:2rem;">
                    No se encontraron clientes
                </td>
            </tr>`;
        return;
    }

    lista.forEach(function(c) {
        const tipoClase = c.tipo === 'FERRETERO' ? 'tipo-etiqueta--ferretero' : 'tipo-etiqueta--normal';
        const tipoTexto = c.tipo === 'FERRETERO' ? 'Ferretero' : 'Normal';

        tablaClientes.innerHTML += `
            <tr>
                <td>${c.nombre}</td>
                <td>${c.telefono || '—'}</td>
                <td>${c.direccion || '—'}</td>
                <td>${c.ciudad || '—'}</td>
                <td><span class="tipo-etiqueta ${tipoClase}">${tipoTexto}</span></td>
                <td>
                    <button class="accion-btn" onclick="verCliente(${c.id})">Ver</button>
                    <button class="accion-btn accion-btn--pedidos" onclick="verPedidos(${c.id})">Pedidos</button>
                </td>
            </tr>`;
    });
}

function filtrarClientes() {
    const nombre = inputNombre.value.toLowerCase();
    const telefono = inputTelefono.value.toLowerCase();
    const tipo = selectTipo.value;

    const filtrados = clientes.filter(function(c) {
        const coincideNombre = c.nombre.toLowerCase().includes(nombre);
        const coincideTelefono = (c.telefono || '').toLowerCase().includes(telefono);
        const coincideTipo = tipo === '' || (c.tipo || 'NORMAL') === tipo;
        return coincideNombre && coincideTelefono && coincideTipo;
    });

    renderizarTabla(filtrados);
}

inputNombre.addEventListener('input', filtrarClientes);
inputTelefono.addEventListener('input', filtrarClientes);
selectTipo.addEventListener('change', filtrarClientes);

cargarClientes();