const btnCorreo = document.getElementById('btn-correo');
const btnTelefono = document.getElementById('btn-telefono');
const inputIdentificador = document.getElementById('identificador');
const labelIdentificador = document.getElementById('label-identificador');
const inputContrasena = document.getElementById('contrasena');
const loginError = document.getElementById('login-error');

btnCorreo.addEventListener('click', function() {
    btnCorreo.classList.add('login-selector__btn--activo');
    btnTelefono.classList.remove('login-selector__btn--activo');
    labelIdentificador.textContent = 'Correo';
    inputIdentificador.type = 'email';
    inputIdentificador.placeholder = 'correo@nexventa.com';
});

btnTelefono.addEventListener('click', function() {
    btnTelefono.classList.add('login-selector__btn--activo');
    btnCorreo.classList.remove('login-selector__btn--activo');
    labelIdentificador.textContent = 'Teléfono';
    inputIdentificador.type = 'tel';
    inputIdentificador.placeholder = '5512345678';
});

document.getElementById('btn-ingresar').addEventListener('click', function() {
    const identificador = inputIdentificador.value.trim();
    const contrasena = inputContrasena.value.trim();

    if (!identificador || !contrasena) {
        loginError.textContent = 'Por favor llena todos los campos';
        return;
    }

    fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador, contrasena })
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Credenciales incorrectas');
        return response.json();
    })
    .then(function(usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = 'inicio.html';
    })
    .catch(function(error) {
        loginError.textContent = error.message;
    });
});