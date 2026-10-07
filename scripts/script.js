//Validación formulario de contacto
const form = document.getElementById("form-validacion");

if (form) {
  //Seleccionamos los inputs por su ID
  const inputNombre = document.getElementById("nombre");
  const inputCorreo = document.getElementById("email");
  const inputTelefono = document.getElementById("telefono");

  //Expresiones
  const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, //Letras y espacios, pueden llevar acentos. Longitud entre 1 y 40 caracteres
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, //Texto inicial seguido de una arroba, nombre del dominio, un punto y la extensión final
    telefono: /^\d{7,14}$/, //Entre 7 y 14 números
  };

  //Validamos lo que el usuario escribe en el input y lo compara con la expresión
  const validarCampo = (expresion, input) => {
    if (expresion.test(input.value)) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity("Error");
    }
  };

  //Validaciones al teclear
  inputNombre.addEventListener("input", () =>
    validarCampo(expresiones.nombre, inputNombre),
  );
  inputCorreo.addEventListener("input", () =>
    validarCampo(expresiones.correo, inputCorreo),
  );
  inputTelefono.addEventListener("input", () =>
    validarCampo(expresiones.telefono, inputTelefono),
  );

  // Validación al enviar
  form.addEventListener("submit", (e) => {
    // Evita recargar la página
    e.preventDefault();
    // Activa los estilos CSS de advertencia
    form.classList.add("was-validated");
    // Comprueba si el formulario es válido
    if (form.checkValidity()) {
      alert("¡Registro exitoso! Me pondré en contacto contigo pronto.");
      //Resetea el formulario
      form.reset();
      //Elimina la clase para ocultar las alertas de nuevo
      form.classList.remove("was-validated");
    } else {
      alert("Todos los campos son obligatorios");
    }
  });
}

// Actualiza la hora cada segundo e indica si la tienda está abierta
function actualizarReloj() {
  var ahora = new Date();
  document.getElementById("reloj").textContent =
    ahora.toLocaleTimeString("es-MX");

  var abierta = ahora.getHours() >= 11 && ahora.getHours() < 20;
  var estadoTienda = document.getElementById("estado-tienda");

  if (abierta) {
    estadoTienda.textContent = "(Abierto hasta las 20:00)";
    estadoTienda.className = "tienda-abierta";
  } else {
    estadoTienda.textContent = "(Cerrado. Abrimos a las 11:00)";
    estadoTienda.className = "tienda-cerrada";
  }
}

//Productos del catálogo
const productosDB = {
  "prod-1": {
    id: "prod-1",
    producto: "BTS - Rolling Stone",
    descripcion: "Edición especial",
    precio: 3451,
    imagen: "img/bts.png",
  },
  "prod-2": {
    id: "prod-2",
    producto: "NCT127: BLINGY",
    descripcion: "Camisa de algodón",
    precio: 377,
    imagen: "img/nct.png",
  },
  "prod-3": {
    id: "prod-3",
    producto: "One-Room TA",
    descripcion: "Llavero de teclas",
    precio: 287,
    imagen: "img/llavero.png",
  },
  "prod-4": {
    id: "prod-4",
    producto: "Alien Stage",
    descripcion: "Póster de colección de Anakt Garden",
    precio: 161,
    imagen: "img/alien.png",
  },
  "prod-5": {
    id: "prod-5",
    producto: "Debut or Die",
    descripcion: "Parte 4 Set (Pasta dura + Cubierta de libro + Mini Póster)",
    precio: 1959,
    imagen: "img/debut.png",
  },
  "prod-6": {
    id: "prod-6",
    producto: "On the Way to Meet Mom",
    descripcion: "Versión especial Vol. 3 y 4",
    precio: 898,
    imagen: "img/mom.png",
  },
  "prod-7": {
    id: "prod-7",
    producto: "SKINFOOD Mascarilla",
    descripcion: "Mascarilla facial de albaricoque",
    precio: 215,
    imagen: "img/apricot.png",
  },
  "prod-8": {
    id: "prod-8",
    producto: "SKINFOOD Tónico",
    descripcion: "Tónico de aguacate",
    precio: 269,
    imagen: "img/toner.png",
  },
  "prod-9": {
    id: "prod-9",
    producto: "Neoflam",
    descripcion: "Juego de 4 cuchillos con revestimiento de titanio",
    precio: 400,
    imagen: "img/cuchillo.png",
  },
  "prod-10": {
    id: "prod-10",
    producto: "Neoflam x Miffy",
    descripcion: "Cacerola de leche de 16 cm",
    precio: 2150,
    imagen: "img/cacerola.png",
  },

  "prod-11": {
    id: "prod-11",
    producto: "El punto de vista del lector omnisciente",
    descripcion: "Set de libros de bolsillo",
    precio: 1689,
    imagen: "img/orvSet2.png",
  },

};

//Carrito y calculadora de divisas
//Tipo de cambio a 30 de septiembre
var tasasCambio = { MXN: 1, USD: 0.055, EUR: 0.049 };
var simbolos = { MXN: "$", USD: "US$", EUR: "€" };
var ENVIO_GRATIS_DESDE = 900;
var COSTO_ENVIO = 80;
var carrito = {};

function formatearMoneda(montoMXN, moneda) {
  return simbolos[moneda] + (montoMXN * tasasCambio[moneda]).toFixed(2);
}

function guardarCarrito() {
  try {
    localStorage.setItem("carrito-toon", JSON.stringify(carrito));
  } catch (e) {}
}

function cargarCarrito() {
  try {
    carrito = JSON.parse(localStorage.getItem("carrito-toon")) || {};
  } catch (e) {
    carrito = {};
  }
}

//Botón ir hacia arriba
window.onscroll = function(){
  if(document.documentElement.scrollTop > 100){
    document.querySelector('.go-top-container').classList.add('show');
  }else{
    document.querySelector('.go-top-container').classList.remove('show');
  }
}

document.querySelector('.go-top-container').addEventListener('click', () =>{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

//Cambio de tema
//Esperar al html
document.addEventListener("DOMContentLoaded", () => {
  const btnTema = document.getElementById("btn-tema");

  if (btnTema) {
    //Buscar el símbolo
    const iconoTema = btnTema.querySelector(".material-symbols-outlined");

    const temaGuardado = localStorage.getItem("tema-toonie");

    if (temaGuardado === "oscuro") {
      document.body.classList.add("modo-oscuro");
      iconoTema.textContent = "light_mode"; //Cambiamos el icono
    }

    btnTema.addEventListener("click", function () {
      //Modificamos la clase
      document.body.classList.toggle("modo-oscuro");

      //Verificamos qué modo tiene
      if (document.body.classList.contains("modo-oscuro")) {
        localStorage.setItem("tema-toonie", "oscuro");
        iconoTema.textContent = "light_mode";
      } else {
        localStorage.setItem("tema-toonie", "claro");
        iconoTema.textContent = "dark_mode";
      }
    });
  }
});
