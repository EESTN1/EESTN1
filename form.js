import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// Configuración de Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Evento enviar formulario
document.getElementById("form").addEventListener("submit", async function(e){

    e.preventDefault();

    let DNI = document.getElementById("DNI").value;
    let apellido = document.getElementById("Apellido").value;
    let nombre = document.getElementById("Nombre").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("Telefono").value;
    let localidad = document.getElementById("localidad").value;
    let provincia = document.getElementById("Provincia").value;
    let fecha = document.getElementById("fecha-nacimiento").value;

  // Obtener valores de radio buttons (agregamos el || null para evitar el undefined)
    let talle = document.querySelector('input[name="talle"]:checked')?.id || null;
    let distancia = document.querySelector('input[name="Distancia"]:checked')?.id;

    // Validación básica
    if(!DNI || !apellido || !nombre || !talle || !email){
        alert("Por favor completa todos los campos obligatorios");
        return;
    }

    try {
        // Guardar en Firebase (espera a que termine)
        await push(ref(db, "inscripciones"), {
            DNI,
            apellido,
            nombre,
            email,
            telefono,
            localidad,
            provincia,
            fechaNacimiento: fecha,
            talle,
            distancia
        });

        // Redirigir a la página de pago
        window.location.href = "/EESTN1/pago/p1.html";

    } catch (error) {
        alert("Error al enviar la inscripción ❌");
        console.error(error);
    }

});
