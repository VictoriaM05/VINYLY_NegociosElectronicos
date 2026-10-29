(function () {
  const CLAVE_CARRITO = 'carritoVinyly';
  const CLASE_ANIMACION = 'nav-carrito-contador--pop';

  function inicializarNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || navbar.dataset.carritoInicializado === 'true') {
      return;
    }

    const enlaceCarrito = navbar.querySelector('.nav-icons a[href="carrito.html"]');
    if (!enlaceCarrito) {
      return;
    }

    navbar.dataset.carritoInicializado = 'true';

    const espacioNombresSvg = 'http://www.w3.org/2000/svg';
    const icono = document.createElementNS(espacioNombresSvg, 'svg');
    icono.setAttribute('viewBox', '0 0 24 24');
    icono.setAttribute('width', '22');
    icono.setAttribute('height', '22');
    icono.setAttribute('aria-hidden', 'true');
    icono.setAttribute('focusable', 'false');

    const trazo = document.createElementNS(espacioNombresSvg, 'path');
    trazo.setAttribute('d', 'M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 7H6');
    trazo.setAttribute('fill', 'none');
    trazo.setAttribute('stroke', 'currentColor');
    trazo.setAttribute('stroke-width', '2');
    trazo.setAttribute('stroke-linecap', 'round');
    trazo.setAttribute('stroke-linejoin', 'round');
    icono.appendChild(trazo);

    const ruedas = document.createElementNS(espacioNombresSvg, 'path');
    ruedas.setAttribute('d', 'M10 19.5h.01M18 19.5h.01');
    ruedas.setAttribute('fill', 'none');
    ruedas.setAttribute('stroke', 'currentColor');
    ruedas.setAttribute('stroke-width', '2');
    ruedas.setAttribute('stroke-linecap', 'round');
    icono.appendChild(ruedas);

    const contador = document.createElement('span');
    contador.className = 'nav-carrito-contador';
    contador.hidden = true;
    enlaceCarrito.replaceChildren(icono, contador);
    enlaceCarrito.setAttribute('aria-label', 'Carrito');
    enlaceCarrito.setAttribute('title', 'Carrito');

    let totalAnterior = null;

    function actualizarContador() {
      let total = 0;

      try {
        const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);
        const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

        if (Array.isArray(carrito)) {
          carrito.forEach(function (producto) {
            if (
              producto &&
              typeof producto === 'object' &&
              typeof producto.cantidad === 'number' &&
              Number.isFinite(producto.cantidad) &&
              producto.cantidad > 0
            ) {
              total += producto.cantidad;
            }
          });
        }
      } catch (error) {
        total = 0;
      }

      contador.textContent = total > 9 ? '9+' : String(total);
      contador.hidden = total === 0;
      enlaceCarrito.setAttribute(
        'aria-label',
        total === 0 ? 'Carrito' : 'Carrito, ' + total + (total === 1 ? ' producto' : ' productos')
      );

      if (totalAnterior !== null && total > totalAnterior) {
        contador.classList.remove(CLASE_ANIMACION);
        void contador.offsetWidth;
        contador.classList.add(CLASE_ANIMACION);
      }

      totalAnterior = total;
    }

    contador.addEventListener('animationend', function () {
      contador.classList.remove(CLASE_ANIMACION);
    });

    actualizarContador();
    window.addEventListener('pageshow', actualizarContador);
    window.addEventListener('storage', function (evento) {
      if (evento.key === CLAVE_CARRITO || evento.key === null) {
        actualizarContador();
      }
    });
    window.addEventListener('carrito:actualizado', actualizarContador);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarNavbar, { once: true });
  } else {
    inicializarNavbar();
  }
})();
