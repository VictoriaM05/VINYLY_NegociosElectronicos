(function () {
  'use strict';

  const CLAVE_PEDIDOS = 'pedidosVinyly';
  const PRODUCTOS_CATALOGO = typeof productos !== 'undefined' && Array.isArray(productos)
    ? productos
    : [];

  function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function convertirPrecio(precio) {
    if (typeof precio === 'number' && Number.isFinite(precio)) {
      return precio;
    }

    const numero = Number(String(precio || '')
      .replace(/\$/g, '')
      .replace(/MXN/gi, '')
      .replace(/\s/g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, ''));

    return Number.isFinite(numero) ? numero : 0;
  }

  function productoCatalogo(id, cantidad) {
    const producto = PRODUCTOS_CATALOGO.find(function (elemento) {
      return elemento.id === id;
    });

    if (!producto) {
      throw new Error('No se encontró un producto del catálogo para los pedidos de ejemplo.');
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      artista: producto.artista,
      precio: convertirPrecio(producto.precio),
      cantidad: cantidad,
      foto: producto.foto || '',
      imagen: producto.imagen || ''
    };
  }

  const PEDIDOS_EJEMPLO = [
    {
      folio: 'VNY-1042',
      fecha: '2026-10-12T12:00:00.000Z',
      cliente: { nombre: 'Pedrito Vinilo', correo: 'pedrito@vinyly.com' },
      direccion: {
        nombre: 'Pedrito Vinilo',
        calle: 'Calle del Vinilo 104',
        colonia: 'Centro',
        ciudad: 'Ciudad de México',
        estado: 'Ciudad de México',
        cp: '06000',
        telefono: '5551234567'
      },
      metodoPago: 'tarjeta',
      pagoDetalle: { marca: 'Visa', ultimos4: '1042' },
      productos: [productoCatalogo(1, 1), productoCatalogo(4, 1)],
      subtotal: 1420,
      descuento: 0,
      codigoDescuento: '',
      total: 1420,
      estado: 'Entregado'
    },
    {
      folio: 'VNY-1038',
      fecha: '2026-09-28T12:00:00.000Z',
      cliente: { nombre: 'Pedrito Vinilo', correo: 'pedrito@vinyly.com' },
      direccion: {
        nombre: 'Pedrito Vinilo',
        calle: 'Calle del Vinilo 104',
        colonia: 'Centro',
        ciudad: 'Ciudad de México',
        estado: 'Ciudad de México',
        cp: '06000',
        telefono: '5551234567'
      },
      metodoPago: 'transferencia',
      pagoDetalle: { referencia: 'VNY-1038' },
      productos: [productoCatalogo(2, 1)],
      subtotal: 780,
      descuento: 0,
      codigoDescuento: '',
      total: 780,
      estado: 'En camino'
    },
    {
      folio: 'VNY-1029',
      fecha: '2026-09-14T12:00:00.000Z',
      cliente: { nombre: 'Pedrito Vinilo', correo: 'pedrito@vinyly.com' },
      direccion: {
        nombre: 'Pedrito Vinilo',
        calle: 'Calle del Vinilo 104',
        colonia: 'Centro',
        ciudad: 'Ciudad de México',
        estado: 'Ciudad de México',
        cp: '06000',
        telefono: '5551234567'
      },
      metodoPago: 'ewallet',
      pagoDetalle: { proveedor: 'E-wallet simulada' },
      productos: [productoCatalogo(3, 1)],
      subtotal: 950,
      descuento: 0,
      codigoDescuento: '',
      total: 950,
      estado: 'Entregado'
    }
  ];

  function leerPedidosGuardados() {
    const contenido = localStorage.getItem(CLAVE_PEDIDOS);
    if (contenido === null) {
      return [];
    }

    const pedidos = JSON.parse(contenido);
    if (!Array.isArray(pedidos)) {
      throw new Error('El historial guardado de pedidos no tiene un formato válido.');
    }

    return pedidos;
  }

  function leerPedidos() {
    try {
      return copiar(PEDIDOS_EJEMPLO.concat(leerPedidosGuardados()).sort(function (a, b) {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }));
    } catch (error) {
      throw new Error('No se pudieron leer los pedidos: ' + error.message);
    }
  }

  function obtenerPedido(folio) {
    try {
      const folioBuscado = String(folio || '').replace(/^#/, '').trim();
      const pedido = PEDIDOS_EJEMPLO.concat(leerPedidosGuardados()).find(function (elemento) {
        return elemento.folio === folioBuscado;
      });

      return pedido ? copiar(pedido) : null;
    } catch (error) {
      throw new Error('No se pudo obtener el pedido: ' + error.message);
    }
  }

  function contarPedidos() {
    try {
      return PEDIDOS_EJEMPLO.length + leerPedidosGuardados().length;
    } catch (error) {
      throw new Error('No se pudieron contar los pedidos: ' + error.message);
    }
  }

  function formatearFecha(iso) {
    try {
      const fecha = new Date(iso);
      if (typeof iso !== 'string' || Number.isNaN(fecha.getTime())) {
        throw new Error('La fecha no es válida.');
      }

      return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(fecha);
    } catch (error) {
      throw new Error('No se pudo formatear la fecha: ' + error.message);
    }
  }

  function crearPedido(datos) {
    try {
      if (!datos || !datos.direccion || !['tarjeta', 'transferencia', 'ewallet'].includes(datos.metodoPago)) {
        throw new Error('Faltan datos válidos para crear el pedido.');
      }

      const carrito = obtenerCarrito();
      if (!Array.isArray(carrito) || carrito.length === 0) {
        throw new Error('No se puede crear un pedido con el carrito vacío.');
      }

      const productosPedido = carrito.map(function (producto) {
        return {
          id: producto.id,
          nombre: String(producto.nombre || ''),
          artista: String(producto.artista || ''),
          precio: convertirPrecio(producto.precio),
          cantidad: Number(producto.cantidad),
          foto: String(producto.foto || ''),
          imagen: String(producto.imagen || '')
        };
      });

      const subtotal = calcularSubtotal(productosPedido);
      const promocion = obtenerDescuentoAplicado();
      const descuento = promocion
        ? Math.min(calcularDescuento(promocion, productosPedido), subtotal)
        : 0;
      const entradaDireccion = datos.direccion || {};
      const nombreCliente = String(entradaDireccion.nombre || '').trim() || 'Pedrito Vinilo';
      const direccion = {};
      ['nombre', 'calle', 'colonia', 'ciudad', 'estado', 'cp', 'telefono'].forEach(function (campo) {
        direccion[campo] = String(entradaDireccion[campo] || '').trim() || 'No proporcionado';
      });

      let pagoDetalle;
      if (datos.metodoPago === 'tarjeta') {
        const detalle = datos.pagoDetalle || {};
        const ultimos4 = String(detalle.ultimos4 || '');
        const marcas = ['Visa', 'Mastercard', 'American Express', 'Tarjeta'];
        const marca = marcas.includes(detalle.marca) ? detalle.marca : 'Tarjeta';
        pagoDetalle = {
          marca: marca,
          ultimos4: /^\d{4}$/.test(ultimos4) ? ultimos4 : '—'
        };
      } else if (datos.metodoPago === 'transferencia') {
        pagoDetalle = { referencia: String((datos.pagoDetalle || {}).referencia || '') };
      } else {
        pagoDetalle = { proveedor: 'E-wallet simulada' };
      }

      const pedidosGuardados = leerPedidosGuardados();
      const folios = PEDIDOS_EJEMPLO.concat(pedidosGuardados).map(function (pedido) {
        const coincidencia = /^VNY-(\d+)$/.exec(String(pedido.folio || ''));
        return coincidencia ? Number(coincidencia[1]) : 0;
      });
      let siguienteFolio = Math.max(1042, ...folios) + 1;
      let folio = 'VNY-' + siguienteFolio;
      while (PEDIDOS_EJEMPLO.concat(pedidosGuardados).some(function (pedido) {
        return pedido.folio === folio;
      })) {
        siguienteFolio += 1;
        folio = 'VNY-' + siguienteFolio;
      }

      const pedido = {
        folio: folio,
        fecha: new Date().toISOString(),
        cliente: {
          nombre: nombreCliente,
          correo: 'pedrito@vinyly.com'
        },
        direccion: direccion,
        metodoPago: datos.metodoPago,
        pagoDetalle: pagoDetalle,
        productos: productosPedido,
        subtotal: subtotal,
        descuento: descuento,
        codigoDescuento: promocion ? promocion.codigo : '',
        total: Math.max(0, subtotal - descuento),
        estado: 'Pagado'
      };

      pedidosGuardados.push(pedido);
      localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidosGuardados));
      window.dispatchEvent(new CustomEvent('pedidos:actualizados'));

      return { ok: true, persistido: true, pedido: copiar(pedido) };
    } catch (error) {
      return {
        ok: false,
        persistido: false,
        pedido: null,
        error: error.message || 'No se pudo guardar el pedido.'
      };
    }
  }

  window.PedidosVinyly = Object.freeze({
    crearPedido: crearPedido,
    leerPedidos: leerPedidos,
    obtenerPedido: obtenerPedido,
    contarPedidos: contarPedidos,
    formatearFecha: formatearFecha
  });
}());
