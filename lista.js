import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2-8MZbijas8pnkm8dn5WI8LLyVo_IA_Y",
    authDomain: "carrera-tecnica.firebaseapp.com",
    databaseURL: "https://carrera-tecnica-default-rtdb.firebaseio.com",
    projectId: "carrera-tecnica",
    storageBucket: "carrera-tecnica.firebasestorage.app",
    messagingSenderId: "530584950692",
    appId: "1:530584950692:web:97aa93c7b3f3fabb171331",
    measurementId: "G-C0B5SNZHQ0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias al HTML
const lista4 = document.getElementById("lista4km");
const lista8 = document.getElementById("lista8km");
const listaBusqueda = document.getElementById("listaCorredores");
const buscador = document.getElementById("buscador");

let datosCorredores = []; // Variable global para guardar lo que viene de Firebase

// --- 1. FUNCIÓN PARA CREAR ELEMENTOS (Fábrica de LI) ---
function crearFilaCorredor(id, datos) {
    const li = document.createElement("li");
    
    const texto = document.createElement("span");
    texto.textContent = `${datos.nombre} ${datos.apellido} | DNI: ${datos.DNI} | [Talle: ${datos.talle || 'S/N'}]`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = datos.pago || false;

    // Vinculación directa a Firebase
    checkbox.addEventListener("change", () => {
        update(ref(db, "inscripciones/" + id), {
            pago: checkbox.checked
        });
    });

    li.appendChild(texto);
    li.appendChild(checkbox);
    return li;
}

// --- 2. FUNCIÓN PARA DIBUJAR LAS LISTAS ---
function renderizarListas() {
    const filtro = buscador.value.toLowerCase().trim();

    // Limpiamos las tres listas antes de dibujar
    lista4.innerHTML = "";
    lista8.innerHTML = "";
    listaBusqueda.innerHTML = "";

    datosCorredores.forEach(corredor => {
        const { id, datos } = corredor;
        const nombreCompleto = `${datos.nombre} ${datos.apellido}`.toLowerCase();
        const dniString = datos.DNI ? datos.DNI.toString() : "";

        // Dibujar en listas generales (4km / 8km)
        const filaOriginal = crearFilaCorredor(id, datos);
        if (datos.distancia === "4km") {
            lista4.appendChild(filaOriginal);
        } else if (datos.distancia === "8km") {
            lista8.appendChild(filaOriginal);
        }

        // Dibujar en lista de buscador (si hay coincidencia)
        if (filtro !== "" && (nombreCompleto.includes(filtro) || dniString.includes(filtro))) {
            const filaBusqueda = crearFilaCorredor(id, datos);
            listaBusqueda.appendChild(filaBusqueda);
        }
    });
}

// --- 3. ESCUCHAR FIREBASE ---
onValue(ref(db, "inscripciones"), (snapshot) => {
    datosCorredores = []; // Vaciamos el array local
    
    snapshot.forEach((childSnapshot) => {
        datosCorredores.push({
            id: childSnapshot.key,
            datos: childSnapshot.val()
        });
    });

    renderizarListas(); // Dibujamos todo apenas llegan datos
});

// --- 4. ESCUCHAR EL BUSCADOR (INSTANTÁNEO) ---
buscador.addEventListener("input", renderizarListas);
