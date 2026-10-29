(function () {
  const CLAVE_CARRITO = 'carritoVinyly';
  const CLASE_ANIMACION = 'nav-carrito-contador--pop';
  const BREAKPOINT_MENU = 1140;

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
    const navLinks = navbar.querySelector('.nav-links');
    const navIcons = navbar.querySelector('.nav-icons');
    const enlaceLogin = navIcons.querySelector('a[href="login.html"]');

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

    let botonMenu = null;

    if (navLinks && navIcons && enlaceLogin) {
      if (!navLinks.id) {
        navLinks.id = 'nav-panel';
      }

      const elementoPanelAcceso = document.createElement('li');
      elementoPanelAcceso.className = 'nav-panel-acceso';
      const enlacePanelAcceso = document.createElement('a');
      enlacePanelAcceso.href = enlaceLogin.href;
      enlacePanelAcceso.className = 'btn-gradiente';
      enlacePanelAcceso.textContent = 'Iniciar sesión';
      elementoPanelAcceso.appendChild(enlacePanelAcceso);
      navLinks.appendChild(elementoPanelAcceso);

      botonMenu = document.createElement('button');
      botonMenu.type = 'button';
      botonMenu.className = 'nav-toggle';
      botonMenu.setAttribute('aria-label', 'Abrir menú');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-controls', navLinks.id);

      for (let indice = 0; indice < 3; indice += 1) {
        const linea = document.createElement('span');
        linea.className = 'nav-toggle-line';
        linea.setAttribute('aria-hidden', 'true');
        botonMenu.appendChild(linea);
      }

      navbar.appendChild(botonMenu);

      function cerrarMenu(devolverFoco) {
        navbar.classList.remove('navbar--abierto');
        document.body.classList.remove('nav-abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
        botonMenu.setAttribute('aria-label', 'Abrir menú');

        if (devolverFoco) {
          botonMenu.focus();
        }
      }

      botonMenu.addEventListener('click', function (evento) {
        const estaAbierto = navbar.classList.toggle('navbar--abierto');
        botonMenu.setAttribute('aria-expanded', String(estaAbierto));
        botonMenu.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
        document.body.classList.toggle('nav-abierto', estaAbierto);

        if (estaAbierto && evento.detail === 0) {
          const primerEnlace = navLinks.querySelector('a');
          if (primerEnlace) {
            primerEnlace.focus();
          }
        }
      });

      navLinks.addEventListener('click', function (evento) {
        if (evento.target.closest('a')) {
          cerrarMenu(false);
        }
      });

      document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && navbar.classList.contains('navbar--abierto')) {
          cerrarMenu(true);
        }
      });

      document.addEventListener('click', function (evento) {
        if (
          navbar.classList.contains('navbar--abierto') &&
          !navbar.contains(evento.target)
        ) {
          cerrarMenu(false);
        }
      });

      const mediaMenu = window.matchMedia('(max-width: ' + BREAKPOINT_MENU + 'px)');
      function cerrarAlAmpliar(evento) {
        if (!evento.matches) {
          cerrarMenu(false);
        }
      }

      if (typeof mediaMenu.addEventListener === 'function') {
        mediaMenu.addEventListener('change', cerrarAlAmpliar);
      } else {
        mediaMenu.addListener(cerrarAlAmpliar);
      }
    }

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
