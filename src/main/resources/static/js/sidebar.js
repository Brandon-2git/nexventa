/**
 * @file sidebar.js
 * @description
 * Este archivo gestiona:
 * - La validación de sesión del usuario mediante localStorage
 * - La carga de información del usuario en el sidebar y topbar
 * - El comportamiento del menu lateral (abrir/cerrar)
 * - El cierre de sesión
 */


/**
 * Obtiene el usuario almacenando en localStorage
 * si no existe, redirige al login
 */
const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
    window.location.href = 'login.html';
}

/**
 * Muestra el nombre, rol, avatar (inicial) del usuario en el sidebar
 */
document.getElementById('usuario-nombre').textContent = usuario.nombre;
document.getElementById('usuario-rol').textContent = usuario.rol;
document.getElementById('usuario-avatar').textContent = usuario.nombre.charAt(0);

/**
 * Muestra el avatar e información del usuario en la topbar si existen los elementos
 */
const topbarAvatar = document.getElementById('topbar-avatar');
const topbarNombre = document.getElementById('topbar-nombre');
if (topbarAvatar) topbarAvatar.textContent = usuario.nombre.charAt(0);
if (topbarNombre) topbarNombre.textContent = usuario.nombre;

// Menu hamburguesa
const btnMenu = document.getElementById('btn-menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.getElementById('sidebar-overlay');

/**
 * Abre o cierra el sidebar al hacer clic en el botón de menú
 */
btnMenu.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar--abierto');
    overlay.classList.toggle('sidebar__overlay--visible');
});

/**
 * Cierra el sidebar al hacer clic en el overlay
 */
overlay.addEventListener('click', function() {
    sidebar.classList.remove('sidebar--abierto');
    overlay.classList.remove('sidebar__overlay--visible');
});

/**
 * Cierra el sidebar al hacer click en el botón de cerrar
 */
document.getElementById('btn-cerrar-menu').addEventListener('click', function() {
    sidebar.classList.remove('sidebar--abierto');
    overlay.classList.remove('sidebar__overlay--visible');
});

/**
 * Elimina la sesión del usuario del localStorage
 * y redirige al login
 */
document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});