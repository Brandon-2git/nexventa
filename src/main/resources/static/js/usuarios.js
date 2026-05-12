/**
 * @file usuarios.js
 * @description Gestión de usuarios del sistema Nexventa
 * Permite listar, crear, editar, activar y desactivar usuarios
 * Acceso restringidoa a roles ADMIN y VENDEDOR
 */

const BASE_URL = window.location.origin;

// Referencias al DOM usados para interaccion y renderizado
const tablaUsuarios = document.getElementById('tabla-usuarios');
const inputBuscar = document.getElementById('input-buscar');
const selectRol = document.getElementById('select-rol');
const modalOverlay = document.getElementById('modal-overlay');
const modalTitulo = document.getElementById('modal-titulo');
const modalError = document.getElementById('modal-error');
const modalConfirmarOverlay = document.getElementById('modal-confirmar-overlay');

//Estado de la aplicacion en memora
let usuarios = [];
let usuarioEditandoId = null;
let usuarioDesactivandoId = null;

/**
 * Obtiene la lista de usuarios desde el backend
 * y renderiza la tabla
 */
function cargarUsuarios(){
    fetch(BASE_URL + '/usuarios')
        .then(r => r.json())
        .then(data => {
            usuarios = data;
            renderizarTabla(usuarios);
        });
}


/**
 * Renderiza la lista de usuarios en la tabla html
 * Aplica estilos de rol y botones de accion
 * @param {Array} lista - lista de usuarios a mostrar
 */
function renderizarTabla(lista){
    tablaUsuarios.innerHTML = '';
    
    //Muestra mensaje cuando no hay resultados
    if (lista.length === 0){
        tablaUsuarios.innerHTML = `
            <tr>
                <td colSpan="6" style="text-align:center; color:#999; padding:2rem;">
                    No se encontraron usuarios
                </td>            
            </tr>`;
            return;
    }

    //Recorre la lista de usuarios para generar una fila por cada uno en la tabla
    lista.forEach(function(u) {
        //Se definen las clases/valores dinámicos según el estado del usuario (para estilos y texto en UI)
        const filaInactiva = !u.activo ? 'fila-inactiva' : '';
        const estadoClase = u.activo ? 'estado-etiqueta--activo' : 'estado-etiqueta--inactivo';
        const estadoTexto = u.activo ? 'Activo' : 'Inactivo';
        const rolClase = 'rol-etiqueta--' + u.rol.toLowerCase();

        //Define el boton de acción dependiendo si el usuario esta activo o no        
        const btnAccion = u.activo 
            ? `<button class="accion-btn accion-btn--desactivar" onclick="confirmarDesactivar(${u.id})">Desactivar</button>`
            : `<button class="accion-btn accion-btn--activar" onclick="activarUsuario(${u.id})">Activar</button>`;

        //Inserta una fila en la tabla con los datos del usuario y clases dinamicas para estilo/comportamiento
        tablaUsuarios.innerHTML += `
            <tr class="${filaInactiva}">
                <td>${u.nombre}</td>
                <td>${u.correo}</td>
                <td>${u.telefono || '—'}</td>
                <td><span class="rol-etiqueta ${rolClase}">${u.rol}</span></td>
                <td><span class="estado-etiqueta ${estadoClase}">${estadoTexto}</span></td>
                <td>
                    <button class="accion-btn" onclick="abrirModalEditar(${u.id})">Editar</button>
                    ${btnAccion}
                </td>
            </tr>`;
    });
}

/**
 * Filtra la tabla en tiempo real por nombre, correo y rol.
 */
function filtrarUsuarios() {
    const texto = inputBuscar.value.toLowerCase();
    const rol = selectRol.value;

    const filtrados = usuarios.filter(function(u) {
        const coincideTexto = u.nombre.toLowerCase().includes(texto) ||
                              u.correo.toLowerCase().includes(texto);
        const coincideRol = rol === '' || u.rol === rol;
        return coincideTexto && coincideRol;
    });

    renderizarTabla(filtrados);
}

// muestra el filtrado al escribir o cambiar el rol
inputBuscar.addEventListener('input', filtrarUsuarios);
selectRol.addEventListener('change', filtrarUsuarios);

/**
 * Abre el modal para crear un nuevo usuario.
 * Limpia los campos y ajusta el selector de rol según el usuario logueado.
 */
function abrirModalNuevo() {
    usuarioEditandoId = null;
    modalTitulo.textContent = 'Nuevo usuario';
    modalError.textContent = '';

    document.getElementById('campo-nombre').value = '';
    document.getElementById('campo-telefono').value = '';
    document.getElementById('campo-correo').value = '';
    document.getElementById('campo-contrasena').value = '';
    document.getElementById('campo-rol').value = '';
    document.getElementById('campo-contrasena-contenedor').style.display = 'flex';

    ajustarRolesPorUsuario();
    modalOverlay.classList.add('modal__overlay--visible');
}

/**
 * Abre el modal para editar un usuario existente.
 * Precarga los campos con los datos actuales del usuario.
 * @param {number} id - ID del usuario a editar
 */
function abrirModalEditar(id) {
    const u = usuarios.find(function(u) { return u.id === id; });
    if (!u) return;

    usuarioEditandoId = id;
    modalTitulo.textContent = 'Editar usuario';
    modalError.textContent = '';

    document.getElementById('campo-nombre').value = u.nombre;
    document.getElementById('campo-telefono').value = u.telefono || '';
    document.getElementById('campo-correo').value = u.correo;
    document.getElementById('campo-rol').value = u.rol;
    document.getElementById('campo-contrasena').value = '';
    document.getElementById('campo-contrasena-contenedor').style.display = 'none';

    ajustarRolesPorUsuario();
    modalOverlay.classList.add('modal__overlay--visible');
}

//Cierra el modal de crear o editar usuario
function cerrarModal() {
    modalOverlay.classList.remove('modal__overlay--visible');
    modalError.textContent = '';
}

/**
 * Ajusta las opciones del selector de rol según el rol del usuario logueado.
 * VENDEDOR solo puede crear QUEMADOR y REPARTIDOR.
 * ADMIN puede crear cualquier rol.
 */    
function ajustarRolesPorUsuario() {
    const campoRol = document.getElementById('campo-rol');
    const rolUsuario = usuario.rol;

    campoRol.innerHTML = '<option value="">Seleccionar rol</option>';

    const roles = rolUsuario === 'ADMIN'
        ? ['ADMIN', 'VENDEDOR', 'QUEMADOR', 'REPARTIDOR']
        : ['QUEMADOR', 'REPARTIDOR'];

    roles.forEach(function(rol) {
        campoRol.innerHTML += `<option value="${rol}">${rol}</option>`;
    });
}

/**
 * Guarda un usuario nuevo o actualiza uno existente.
 * Valida los campos antes de enviar al backend.
 */
function guardarUsuario() {
    const nombre = document.getElementById('campo-nombre').value.trim();
    const telefono = document.getElementById('campo-telefono').value.trim();
    const correo = document.getElementById('campo-correo').value.trim();
    const contrasena = document.getElementById('campo-contrasena').value.trim();
    const rol = document.getElementById('campo-rol').value;

    if (!nombre || !correo || !rol) {
        modalError.textContent = 'Nombre, correo y rol son obligatorios';
        return;
    }

    if (!usuarioEditandoId && !contrasena) {
        modalError.textContent = 'La contraseña es obligatoria';
        return;
    }

    const datos = { nombre, telefono, correo, rol };
    if (contrasena) datos.contrasena = contrasena;

    const url = usuarioEditandoId
        ? BASE_URL + '/usuarios/' + usuarioEditandoId
        : BASE_URL + '/usuarios';

    const metodo = usuarioEditandoId ? 'PUT' : 'POST';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(function(r) {
        if (!r.ok) return r.text().then(function(msg) { throw new Error(msg); });
        return r.json();
    })
    .then(function() {
        cerrarModal();
        cargarUsuarios();
    })
    .catch(function(err) {
        modalError.textContent = err.message;
    });
}

/**
 * Muestra el modal de confirmación antes de desactivar un usuario.
 * @param {number} id - ID del usuario a desactivar
 */
function confirmarDesactivar(id) {
    usuarioDesactivandoId = id;
    modalConfirmarOverlay.classList.add('modal__overlay--visible');
}

/**
 * Confirma y ejecuta la desactivación del usuario seleccionado.
 */
function desactivarUsuario() {
    fetch(BASE_URL + '/usuarios/' + usuarioDesactivandoId + '/desactivar', {
        method: 'PUT'
    })
    .then(function() {
        modalConfirmarOverlay.classList.remove('modal__overlay--visible');
        cargarUsuarios();
    });
}

/**
 * Activa un usuario que estaba inactivo sin pedir confirmación.
 * @param {number} id - ID del usuario a activar
 */
function activarUsuario(id) {
    fetch(BASE_URL + '/usuarios/' + id + '/activar', {
        method: 'PUT'
    })
    .then(function() {
        cargarUsuarios();
    });
}

// Asigna eventos a controles de la interfaz (acciones de usuarios y modales)
document.getElementById('btn-nuevo-usuario').addEventListener('click', abrirModalNuevo);
document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar-modal').addEventListener('click', cerrarModal);
document.getElementById('btn-guardar-usuario').addEventListener('click', guardarUsuario);
document.getElementById('btn-cancelar-desactivar').addEventListener('click', function() {
    modalConfirmarOverlay.classList.remove('modal__overlay--visible');
});
document.getElementById('btn-confirmar-desactivar').addEventListener('click', desactivarUsuario);

// Carga inicial de usuarios al entrar a la página
cargarUsuarios();