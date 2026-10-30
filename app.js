// Variables globales //

let USUARIOS = {
    admin: "admin123",
    usuario: "1234",
    demo: "demo"
};

let usuarioActual = null;
let peliculasGlobales = [];
let peliculasEnEdicion = null;

// ==== Inicialización de app ========= // 

document.addEventListener("DOMContentLoaded", () => {
    inicializarApp(); // Cargar app
    eventos(); // cargar eventos
});

inicializarApp = () => {
    // Cargar usuarios registrados en localStorage
    cargarUsuariosRegistrados();

    // Verificar si hay un usuario logeado
    let userLogged = localStorage.getItem("usuarioLogeado");
    if (userLogged) {
        usuarioActual = JSON.parse(userLogged);
        mostrarDashboard();
    }

    // Cargar datos de películas de ejemplo
    if (!localStorage.getItem("peliculas")) {
        cargarDatosDeEjemplo();
    }

}

function cargarUsuariosRegistrados() {
    // Obteher usuarios de localStorage y agregarlo a la variable USUARIOS
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados"));
    if (usuariosRegistrados) {
        Object.assign(USUARIOS, usuariosRegistrados);
    }
}

// =============Eventos del usuario============ //

function eventos() {
    // boton login
    document.querySelector("#formLogin").addEventListener("submit", userLogin);
    //boton logout
    document.querySelector("#btnLogout").addEventListener("click", logout);
    // boton de registro
    document.querySelector("#formRegistro").addEventListener("submit", register);
    // Boton guardar películas 
    document.querySelector("#btnGuardarPelicula").addEventListener("click", guardarPelicula);
    // Buscador de películas por título
    document.querySelector("#inputBuscar").addEventListener("input", buscarPeliculas);
}



function userLogin(e) {
    e.preventDefault();
    let user = document.querySelector("#inputUser").value;
    let password = document.querySelector("#inputPassword").value;

    if (USUARIOS[user] && USUARIOS[user] === password) {
        usuarioActual = user;
        localStorage.setItem("usuarioLogeado", JSON.stringify(user));
        mostrarDashboard();
        document.querySelector("#formLogin").reset();
    } else {
        alert("El usuario y contraseña no son válidos");
    }

}

function mostrarDashboard() {
    document.querySelector("#loginSection").style.display = "none";
    document.querySelector("#btnLogin").style.display = "none";
    document.querySelector("#mainContent").style.display = "block";
    document.querySelector("#btnLogout").style.display = "block";
    document.querySelector(".userLogged").textContent = usuarioActual;
    document.querySelector("#btnAgregar").style.display = "block";
    // Cargar peliculas
    cargarPeliculas();

}
function mostrarLogin() {
    document.querySelector("#loginSection").style.display = "flex";
    document.querySelector("#btnLogin").style.display = "block";
    document.querySelector("#mainContent").style.display = "none";
    document.querySelector("#btnLogout").style.display = "none";

}

function logout() {
    let confirmar = confirm("¿Deseas cerrar sesión?");
    if (confirmar) {
        usuarioActual = null;
        localStorage.removeItem("usuarioLogeado");
        mostrarLogin();
        document.querySelector("#formLogin").reset();
    }
}

// Register 
function register(e) {
    e.preventDefault();
    const nombre = document.querySelector("#inputNombre").value.trim();
    const emailInput = document.querySelector("#inputEmail");
    const email = emailInput.value.trim();
    const usuario = document.querySelector("#inputUserReg").value.trim();
    const password = document.querySelector("#inputPasswordReg").value;
    const confirmPassword = document.querySelector("#inputConfirmPassword").value;

    if (!nombre || !email || !usuario || !password || !confirmPassword) {
        alert("Todos los campos son obligatorios.");
        return;
    } else {
        if (USUARIOS[usuario]) {
            alert("Usuario ya está registrado. Por favor escriba uno diferente");
            return;
        }
        USUARIOS[usuario] = password; //agregar usuario al listado 
        // Guardar en localStorage
        let usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || {};
        usuariosRegistrados[usuario] = password;
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

        // Registrado con éxito
        alert(`Usuario ${usuario} registrado con éxtio ✅. Inicia sesión`)

        // Limpiar register 
        document.querySelector("#formRegistro").reset();
        document.querySelector("#login-tab").click();
    }

    if (nombre.length <= 4) {
        alert("El nombre debe tener más de 4 caracteres.");
        return;
    }

    if (usuario.length <= 4) {
        alert("El usuario debe tener más de 4 caracteres.");
        return;
    }

    if (!emailInput.validity.valid) {
        alert("Ingresa un correo electrónico válido.");
        return;
    }

    const passwordSegura = password.length >= 8
        && /\p{Ll}/u.test(password)
        && /\p{Lu}/u.test(password)
        && /\p{N}/u.test(password)
        && /[\p{P}\p{S}]/u.test(password);

    if (!passwordSegura) {
        alert("La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula, un número y un símbolo.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }



}

// Peliculas de ejemplo

function cargarDatosDeEjemplo() {
    let peliculasEjemplo = [
        {
            id: 1,
            titulo: "Inception",
            genero: "Ciencia Ficción",
            anno: 2010,
            director: "Christopher Nolan",
            calificacion: 9.5,
            descripcion: "Dom Cobb es un experto en infiltrarse en los sueños para robar secretos. Su nueva misión consiste en implantar una idea en la mente de un objetivo.",
            imagen: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
            fecha: new Date()
        },
        {
            id: 2,
            titulo: "Interestelar",
            genero: "Ciencia Ficción",
            anno: 2014,
            director: "Christopher Nolan",
            calificacion: 8.6,
            descripcion: "Un grupo de astronautas viaja más allá de nuestra galaxia en busca de un planeta que pueda convertirse en un nuevo hogar para la humanidad.",
            imagen: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            fecha: new Date()
        },
        {
            id: 3,
            titulo: "El caballero de la noche",
            genero: "Acción",
            anno: 2008,
            director: "Christopher Nolan",
            calificacion: 9.0,
            descripcion: "Batman enfrenta al Joker, un criminal que busca sumir a Ciudad Gótica en el caos y poner a prueba sus límites.",
            imagen: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            fecha: new Date()
        }
    ];

    // guardar en localStorage
    localStorage.setItem("peliculas", JSON.stringify(peliculasEjemplo));
}

// Cargar peliculas de ejemplo

function cargarPeliculas() {
    let peliculas = localStorage.getItem("peliculas");
    peliculasGlobales = peliculas ? JSON.parse(peliculas) : [];

    // mostrar en el grid las películas
    buscarPeliculas();
    renderizarSlider();
}

function buscarPeliculas() {
    let busqueda = document.querySelector("#inputBuscar").value
        .trim()
        .toLocaleLowerCase();
    let peliculasFiltradas = peliculasGlobales.filter(p =>
        p.titulo.toLocaleLowerCase().includes(busqueda)
    );

    renderizarGrid(peliculasFiltradas);
}

// Renderizar películas 

function renderizarGrid(pelis) {
    let grid = document.querySelector("#gridPeliculas");
    let sinResultados = document.querySelector("#sinResultados");

    if (pelis.length === 0) {
        grid.innerHTML = "";
        sinResultados.style.display = "block";
        return;
    }

    sinResultados.style.display = "none";
    grid.innerHTML = pelis.map(p => `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="movie-card">
                <img
                    src="${p.imagen}"
                    class="movie-image"
                    alt="Portada de ${p.titulo}"
                    onerror="this.onerror=null; this.src='https://placehold.co/600x900/343a40/ffffff?text=Portada+no+disponible';"
                >
                <div class="movie-content">
                    <h5 class="movie-title">${p.titulo}</h5>
                    <span class="movie-genre">${p.genero}</span>
                    <p class="movie-meta mb-1">Director: ${p.director}</p>
                    <p class="movie-meta mb-1">Año: ${p.anno}</p>
                    <p class="movie-rating mb-2">${p.calificacion} ⭐ / 10</p>
                    <p class="movie-description">${p.descripcion}</p>
                    <div class="movie-actions">
                        <button type="button" class="btn btn-info btn-sm" onclick="verDetalles(${p.id})">
                            <i class="bi bi-eye me-1" aria-hidden="true"></i>Ver detalles
                        </button>
                        <button type="button" class="btn btn-warning btn-sm" onclick="editarPeliculas(${p.id})">
                            <i class="bi bi-pencil-square me-1" aria-hidden="true"></i>Editar
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="eliminarPeliculas(${p.id})">
                            <i class="bi bi-trash3 me-1" aria-hidden="true"></i>Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

// Agregar o editar peliculas 
function guardarPelicula() {
    // Obtener los datos del formulario
    let titulo = document.querySelector("#inputTitulo").value;
    let genero = document.querySelector("#inputGenero").value;
    let director = document.querySelector("#inputDirector").value;
    let anno = document.querySelector("#inputAno").value;
    let calificacion = document.querySelector("#inputCalificacion").value;
    let descripcion = document.querySelector("#inputDescripcion").value;
    let imagen = document.querySelector("#inputImagen").value;

    // Validar si estamos editando o agregando una nueva película 
    if (peliculasEnEdicion) {
        // editando pelicula
        // Buscar película en el array de películas 
        let index = peliculasGlobales.findIndex(p => p.id === peliculasEnEdicion.id);
        // Si se encontró la película guardamos en localStorage 
        if (index !== -1) {

            peliculasGlobales[index] = {
                ...peliculasGlobales[index],
                titulo, genero, director, anno, calificacion, descripcion, imagen
            }
            alert("Película actualizada con éxito ✅");

        }


    } else {
        // agregando una nueva película 
        // crear objecto para guardar los datos de la nueva película 
        let nuevaPelicula = {
            id: Date.now(),
            titulo, genero, director, anno, calificacion, descripcion, imagen,
            fecha: new Date()
        }

        // Agregar películas a la lista de películas
        peliculasGlobales.unshift(nuevaPelicula);
        alert("Película agregada con éxito ✅");

    }
    // Agregar película a localStorage
    localStorage.setItem("peliculas", JSON.stringify(peliculasGlobales));
    peliculasEnEdicion = null; // limpiar variable de edición 
    // Cargar películas en grid 
    cargarPeliculas();

    // Cerrar o esconder modal
    bootstrap.Modal.getInstance(document.querySelector("#modalPelicula")).hide();
    document.querySelector("#formPelicula").reset();
}

function editarPeliculas(id) {
    // Encontrar películas para editar 
    let pelicula = peliculasGlobales.find(p => p.id === id);
    // Si se encuentra la película llenamos el formulario
    if (pelicula) {
        peliculasEnEdicion = pelicula;

        document.querySelector("#inputTitulo").value = pelicula.titulo;
        document.querySelector("#inputGenero").value = pelicula.genero;
        document.querySelector("#inputDirector").value = pelicula.director;
        document.querySelector("#inputAno").value = pelicula.anno;
        document.querySelector("#inputCalificacion").value = pelicula.calificacion;
        document.querySelector("#inputDescripcion").value = pelicula.descripcion;
        document.querySelector("#inputImagen").value = pelicula.imagen;
        // Cambiar titulo del modal
        document.querySelector("#modalTitulo").textContent = "Editar Película";

        // Mostrar modal
        let modal = new bootstrap.Modal(document.querySelector("#modalPelicula"));
        console.log(modal)
        modal.show();
    }
}

// Eliminar película 
function eliminarPeliculas(id){
    let confirmar = confirm("¿Desea eliminar esta película?");
    if(confirmar){
        // Buscar o filtrar las peliculas que no tengan el mismo id 
        peliculasGlobales = peliculasGlobales.filter(p => p.id !== id);
        // Guardar las peliculas restantes en localStorage
        localStorage.setItem("peliculas",JSON.stringify(peliculasGlobales));
        // Actualizar el dashboard
        cargarPeliculas();
        // Mostrar confirmación de eliminación 
        alert("Película eliminada con éxito ✅");
    }
}

// Ver detalles de películas 
function verDetalles(id){
    let pelicula = peliculasGlobales.find(p=> p.id === id);
    if(pelicula){
        document.querySelector("#detallesTitulo").textContent = pelicula.titulo;
        document.querySelector("#detallesImagen").src = pelicula.imagen;
        document.querySelector("#detallesGenero").textContent = pelicula.genero;
        document.querySelector("#detallesDirector").textContent = pelicula.director;
        document.querySelector("#detallesAno").textContent = pelicula.anno;
        document.querySelector("#detallesCalificacion").textContent = pelicula.calificacion;
        document.querySelector("#detallesDescripcion").textContent = pelicula.descripcion;
    }

    // Mostrar modal
    let modal = new bootstrap.Modal(document.querySelector("#modalDetalles"));
    modal.show();
}

// Redenrizar peliculas en slider 
function renderizarSlider(){
    let carrusel = document.querySelector("#carouselMovies");
    carrusel.innerHTML="";

    let recientes = peliculasGlobales.slice(0,5);
    recientes.forEach(p => {
        let card = document.createElement("div");
        card.className = "slider-movie-card";
        card.innerHTML = `
            <img
                    src="${p.imagen}"
                    onerror="this.onerror=null; this.src='https://placehold.co/600x900/343a40/ffffff?text=Portada+no+disponible';"
                >
                <div class="slider-movie-info">
                    <h6>${p.titulo}</h6>
                    <small class= "text-muted">${p.anno}</small>
                </div>
    `;
        card.addEventListener("click", () => verDetalles(p.id));
        carrusel.appendChild(card);

    })
}

// Movimiento del scroll 
function scrollSlide(direccion){
    let slider = document.querySelector("#carouselMovies");
    let scroll = 200;
    slider.scrollBy({
        left: direccion * scroll,
        behavior: "smooth"
    });
}