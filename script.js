window.addEventListener('load', init);

let intentos = 6;
let palabra;
let cantCarecteres=0;

document.getElementById("retry-button").addEventListener("click", function() {
    window.location.reload();
});

async function init() {
    palabra = await obtenerPalabraAleatoria();
    const BOTON = document.getElementById("guess-button");
    BOTON.addEventListener("click", intentar);
}

function intentar() {
    const INTENTO = leerIntento();
    if (!INTENTO) {
        return; // Retorna si el intento no es válido
    }
    if (INTENTO === palabra) {
        terminarJuego(true);
        return;
    }
    const GRID = document.getElementById("grid");
    const ROW = document.createElement('div');
    ROW.className = 'row';
    for (let i in palabra) {
        const SPAN = document.createElement('span');
        SPAN.className = 'letter';
        if (INTENTO[i] === palabra[i]) { //VERDE
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = '#79b851';
        } else if (palabra.includes(INTENTO[i])) { //AMARILLO
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = '#f3c237';
        } else { //GRIS
            SPAN.innerHTML = INTENTO[i];
            SPAN.style.backgroundColor = '#a4aec4';
        }
        ROW.appendChild(SPAN);
    }
    GRID.appendChild(ROW);
    actualizarIntentos();
}

function leerIntento() {
    let intento = document.getElementById("guess-input").value.toUpperCase();
    if (intento.length !== cantCarecteres) {
        alert("¡El intento debe tener exactamente "+cantCarecteres+" caracteres!");
        return null; // Retorna null para indicar que el intento no es válido
    }
    return intento;
}

function terminarJuego(ganador) {
    const INPUT = document.getElementById("guess-input");
    INPUT.disabled = true;
    const BOTON = document.getElementById("guess-button");
    BOTON.disabled = true;
    let mensaje = ganador ? "<h1>¡GANASTE!😀</h1>" : "<h1>¡PERDISTE!😖 La palabra correcta era: " + palabra + "</h1>";
    mostrarMensaje(mensaje);
    document.getElementById("retry-button").style.display = "block";
}

function mostrarMensaje(mensaje) {
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje;
}

function actualizarIntentos() {
    intentos--;
    const intentosRestantes = document.getElementById("guesses");
    intentosRestantes.textContent = "Intentos restantes: " + intentos;
    if (intentos === 0) {
        terminarJuego(false);
    }
}


function actualizarInput() {
    const input = document.getElementById("guess-input");
    input.maxLength = cantCarecteres;
    input.placeholder = "Ingresa una palabra de " + cantCarecteres + " letras";
}

async function obtenerPalabraAleatoria() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?lang=es');
        if (!response.ok) {
            throw new Error('No se pudo obtener la palabra');
        }
        const data = await response.json();
        cantCarecteres= data[0].length;
        actualizarInput()
        return data[0].toUpperCase(); // Devuelve la primera palabra en mayúsculas

    } catch (error) {
        console.error('Error al obtener la palabra:', error.message);
        return null;
    }
}
