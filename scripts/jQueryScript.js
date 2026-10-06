//Funciones globales
//Subtotal de acuerdo con script.js
function calcularSubtotal() {
  var suma = 0;
  $.each(carrito, function (id, cantidad) {
    if (productosDB[id]) {
      suma += cantidad * productosDB[id].precio;
    }
  });
  return suma;
}

//Carrito actualizado
function actualizarCarrito() {
  var $lista = $("#lista-carrito").empty();
  var totalPiezas = 0;

  $.each(carrito, function (id, cant) {
    var producto = productosDB[id];
    if (producto && cant > 0) {
      totalPiezas += cant;
      $lista.append(
        '<li style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">' +
          '<div style="display: flex; gap: 15px; align-items: center; flex: 1;">' +
          '<img src="' +
          producto.imagen +
          '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">' +
          "<div>" +
          "<strong>" +
          producto.producto +
          "</strong><br>" +
          '<span style="font-size: 13px; color: #666;">' +
          producto.descripcion +
          "</span>" +
          "</div>" +
          "</div>" +
          '<div class="contador" style="margin: 0; width: 120px; justify-content: center;">' +
          '<button class="menos-cart" data-id="' +
          id +
          '">−</button>' +
          '<span style="margin: 0 10px; min-width: 20px; text-align: center;">' +
          cant +
          "</span>" +
          '<button class="mas-cart" data-id="' +
          id +
          '">+</button>' +
          "</div>" +
          '<strong style="width: 100px; text-align: right;">$' +
          (producto.precio * cant).toFixed(2) +
          "</strong>" +
          '<button class="quitar-cart" data-id="' +
          id +
          '" style="background: none; border: none; color: #BC0202; cursor: pointer; font-size: 18px; width: 40px; text-align: right;">✕</button>' +
          "</li>",
      );
    }
  });

  var subtotal = calcularSubtotal();
  var envio =
    subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  var moneda = $("#moneda").val() || "MXN";

  $("#subtotal").text(formatearMoneda(subtotal, moneda));
  $("#envio").text(envio === 0 ? "Gratis" : formatearMoneda(envio, moneda));
  $("#total").text(formatearMoneda(subtotal + envio, moneda));

  $("#carrito-vacio").toggle(totalPiezas === 0);
  $("#carrito-contenido").toggle(totalPiezas > 0);

  $("#contador-carrito")
    .text(totalPiezas)
    .animate({ opacity: 0.3 }, 100)
    .animate({ opacity: 1 }, 200);
}

//Eventos del DOM
$(document).ready(function () {
  //Funciones de script.js
  if (typeof cargarCarrito === "function") {
    cargarCarrito();
    actualizarCarrito();
  }

  //Carrusel de index.html
  $(".productos-img").on("click", function () {
    $(".productos-img").removeClass("active");
    $(this).addClass("active");
  });

  //Nosotros (reloj y acordeón)
  if ($("#reloj").length > 0 && typeof actualizarReloj === "function") {
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
  }

  $(".acordeon-titulo").on("click", function () {
    $(this).toggleClass("abierto");
    $(this).next(".acordeon-cuerpo").slideToggle(200);
  });

  //Catálogo
  $(".catalogo-container > .producto-card").on("mouseenter", function () {
    $(this).siblings().css("opacity", "0.6");
    $(this)
      .children("img")
      .css({ transition: "transform 0.3s ease", transform: "scale(1.05)" });
  });

  $(".catalogo-container > .producto-card").on("mouseleave", function () {
    $(this).siblings().css("opacity", "1");
    $(this).children("img").css("transform", "scale(1)");
  });

  $(".btn-mas").on("click", function () {
    var $cantidad = $(this).siblings(".cantidad");
    $cantidad.text(parseInt($cantidad.text()) + 1);
  });

  $(".btn-menos").on("click", function () {
    var $cantidad = $(this).siblings(".cantidad");
    var actual = parseInt($cantidad.text());
    if (actual > 1) {
      $cantidad.text(actual - 1);
    }
  });

  // Agregar al carrito
  $(".btn-ordenar").on("click", function () {
    var id = $(this).data("id");
    var cantidadSeleccionada = parseInt(
      $(this).closest(".producto-card").find(".cantidad").text(),
    );

    carrito[id] = (carrito[id] || 0) + cantidadSeleccionada;
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();

    var $btn = $(this);
    var textoOriginal = $btn.text();
    $btn.text("¡Agregado!").css("background-color", "#306D29");
    setTimeout(function () {
      $btn.text(textoOriginal).css("background-color", "");
    }, 1000);
  });

  //Carrusel de catálogo
  function moverDerecha() {
    var $container = $(".catalogo-container");
    var cardWidth = $container.find(".producto-card").outerWidth(true);

    $container.animate({ marginLeft: -cardWidth }, 400, function () {
      $(this).find(".producto-card:first").appendTo(this);
      $(this).css("marginLeft", 0);
    });
  }

  function moverIzquierda() {
    var $container = $(".catalogo-container");
    var cardWidth = $container.find(".producto-card").outerWidth(true);

    $container.find(".producto-card:last").prependTo($container);
    $container.css("marginLeft", -cardWidth);
    $container.animate({ marginLeft: 0 }, 400);
  }

  $(".next").on("click", moverDerecha);
  $(".prev").on("click", moverIzquierda);

  //Barra buscadora
  //Busca lo que el usuario escribe en el input
  $("#buscador").on("input", function () {
    //Lo convierte a minúsculas para buscarlo
    var textoBusqueda = $(this).val().toLowerCase();
    var coincidencias = 0;

    $(".producto-card").each(function () {
      //Busca por etiquetas
      var titulo = $(this).find("h3").text().toLowerCase();
      var descripcion = $(this).find("p").text().toLowerCase();

      if (
        titulo.includes(textoBusqueda) ||
        descripcion.includes(textoBusqueda)
      ) {
        $(this).show();
        coincidencias++;
      } else {
        $(this).hide();
      }
    });
    //Si no hay coincidencias
    if (coincidencias === 0) {
      $("#sin-resultados").removeAttr("hidden").show();
      $(".btn-carrusel").hide();
    } else {
      $("#sin-resultados").hide();
      $(".btn-carrusel").show();
    }
  });

  //Carrito
  $("#lista-carrito").on("click", ".mas-cart", function () {
    var id = $(this).data("id");
    carrito[id]++;
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();
  });

  $("#lista-carrito").on("click", ".menos-cart", function () {
    var id = $(this).data("id");
    carrito[id]--;
    if (carrito[id] <= 0) delete carrito[id];
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();
  });

  $("#lista-carrito").on("click", ".quitar-cart", function () {
    var id = $(this).data("id");
    delete carrito[id];
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();
  });

  $("#moneda").on("change", actualizarCarrito);

  $("#btn-vaciar").on("click", function () {
    carrito = {};
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();
  });

  $("#btn-comprar").on("click", function () {
    var total = $("#total").text();
    carrito = {};
    if (typeof guardarCarrito === "function") guardarCarrito();
    actualizarCarrito();
    alert(
      "¡Compra realizada por " +
        total +
        "!\nGracias por apoyar nuestra tienda.",
    );
  });

  //Menú hamburguesa
  $("#btn-menu").on("click", function () {
    $("nav").toggleClass("mostrar-enlaces");
  });
});
