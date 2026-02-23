document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       MENÚ HAMBURGUESA
    =============================== */

    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("active");
            menuBtn.classList.toggle("active");
        });
    }

    /* ===============================
       CARRUSEL PRINCIPAL
    =============================== */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 0) {

        let mainIndex = 0;

        function showSlide(i) {
            slides.forEach(s => s.classList.remove("active"));
            slides[i].classList.add("active");
        }

        const nextBtn = document.getElementById("nextBtn");
        const prevBtn = document.getElementById("prevBtn");

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                mainIndex = (mainIndex + 1) % slides.length;
                showSlide(mainIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                mainIndex = (mainIndex - 1 + slides.length) % slides.length;
                showSlide(mainIndex);
            });
        }

        setInterval(() => {
            mainIndex = (mainIndex + 1) % slides.length;
            showSlide(mainIndex);
        }, 5000);
    }

    /* ===============================
       SLIDER AUTOMÁTICO PRODUCTOS
    =============================== */

    const sliders = document.querySelectorAll(".producto .slider");

    sliders.forEach(slider => {

        const images = slider.querySelectorAll("img");
        let index = 0;

        if (images.length > 1) {
            setInterval(() => {
                images[index].classList.remove("active");
                index = (index + 1) % images.length;
                images[index].classList.add("active");
            }, 5000);
        }

    });

    /* ===============================
       CARRITO
    =============================== */

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const botones = document.querySelectorAll(".add-to-cart");
    const contador = document.getElementById("cartCount");
    const panel = document.getElementById("panelCarrito");
    const lista = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const btnCarrito = document.getElementById("cartBtn");
    const cerrarCarrito = document.getElementById("cerrarCarrito");
    const finalizarBtn = document.getElementById("finalizarCompra");

    actualizarTodo();

    // Abrir carrito
    if (btnCarrito && panel) {
        btnCarrito.addEventListener("click", () => {
            panel.classList.add("active");
        });
    }

    // Cerrar carrito
    if (cerrarCarrito && panel) {
        cerrarCarrito.addEventListener("click", () => {
            panel.classList.remove("active");
        });
    }

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel) {
            panel.classList.remove("active");
        }
    });

    // Agregar producto
    botones.forEach(boton => {
        boton.addEventListener("click", () => {

            const producto = boton.closest(".producto");
            if (!producto) return;

            const nombre = producto.dataset.name;
            const precio = parseInt(producto.dataset.price);

            let imagenElemento = producto.querySelector(".slider img.active");
            if (!imagenElemento) {
                imagenElemento = producto.querySelector("img");
            }

            const imagen = imagenElemento ? imagenElemento.src : "";

            const existe = carrito.find(p => p.nombre === nombre);

            if (existe) {
                existe.cantidad++;
            } else {
                carrito.push({ nombre, precio, imagen, cantidad: 1 });
            }

            actualizarTodo();
            if (panel) panel.classList.add("active");
        });
    });

    function actualizarTodo() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        renderCarrito();
    }

    function actualizarContador() {
        if (!contador) return;

        let total = 0;
        carrito.forEach(p => total += p.cantidad);

        contador.textContent = total;
        contador.style.display = total > 0 ? "flex" : "none";
    }

    function renderCarrito() {
        if (!lista || !totalCarrito) return;

        lista.innerHTML = "";
        let subtotal = 0;

        carrito.forEach((p, index) => {
            subtotal += p.precio * p.cantidad;

            lista.innerHTML += `
                <div class="item-carrito">
                    <img src="${p.imagen}" class="carrito-img">

                    <div class="item-detalles">
                        <div class="nombre">${p.nombre}</div>
                        <div class="precio">$ ${p.precio.toLocaleString("es-CO")}</div>

                        <div class="controles">
                            <button onclick="cambiarCantidad(${index}, -1)">−</button>
                            <span>${p.cantidad}</span>
                            <button onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>

                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">🗑</button>
                </div>
            `;
        });

        totalCarrito.textContent = "$ " + subtotal.toLocaleString("es-CO");
    }

    // Evitar ir a pago si está vacío
    if (finalizarBtn) {
        finalizarBtn.addEventListener("click", (e) => {
            if (carrito.length === 0) {
                e.preventDefault();
                if (panel) panel.classList.add("active");
            }
        });
    }

    // Hacer funciones globales para botones dinámicos
    window.cambiarCantidad = function(index, cambio) {
        if (!carrito[index]) return;

        carrito[index].cantidad += cambio;

        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }

        actualizarTodo();
    }

    window.eliminarProducto = function(index) {
        if (!carrito[index]) return;

        carrito.splice(index, 1);
        actualizarTodo();
    }

});
