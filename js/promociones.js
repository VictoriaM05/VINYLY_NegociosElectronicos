// Promociones activas de VINYLY. Todo es simulado: no hay backend.
// tipo 'porcentaje': "valor" es el % que se descuenta del subtotal.
// tipo 'dosPorUno': por cada par de vinilos, el más barato sale gratis.
const PROMOCIONES = [
  {
    codigo: 'POP10',
    icono: '🎧',
    etiqueta: '10%',
    titulo: 'Pop de temporada',
    descripcion: '10% de descuento en todo tu pedido.',
    tipo: 'porcentaje',
    valor: 10
  },
  {
    codigo: 'VINYLY15',
    icono: '💿',
    etiqueta: '15%',
    titulo: 'Vinilo de bienvenida',
    descripcion: '15% de descuento para tu primera compra.',
    tipo: 'porcentaje',
    valor: 15
  },
  {
    codigo: 'VINYL2X1',
    icono: '🎁',
    etiqueta: '2x1',
    titulo: '2x1 en vinilos',
    descripcion: 'Lleva dos vinilos y paga solo el más caro.',
    tipo: 'dosPorUno',
    valor: 0
  }
];

const CLAVE_DESCUENTO = 'descuentoVinyly';

// Busca una promoción por su código (sin importar mayúsculas ni espacios).
function buscarPromocion(codigo) {
  const codigoLimpio = String(codigo || '').trim().toUpperCase();
  return PROMOCIONES.find(function (promo) {
    return promo.codigo === codigoLimpio;
  }) || null;
}

// Devuelve la promoción que está aplicada ahora mismo (o null).
function obtenerDescuentoAplicado() {
  try {
    return buscarPromocion(localStorage.getItem(CLAVE_DESCUENTO));
  } catch (error) {
    return null;
  }
}

// Guarda solo el código; el monto se recalcula cada vez con el carrito actual.
function aplicarDescuento(promocion) {
  localStorage.setItem(CLAVE_DESCUENTO, promocion.codigo);
}

function quitarDescuento() {
  localStorage.removeItem(CLAVE_DESCUENTO);
}

// Suma precio x cantidad de todo el carrito.
function calcularSubtotal(carrito) {
  return carrito.reduce(function (suma, producto) {
    return suma + producto.precio * producto.cantidad;
  }, 0);
}

// Cuánto dinero se descuenta con esta promoción y este carrito.
function calcularDescuento(promocion, carrito) {
  if (!promocion || carrito.length === 0) {
    return 0;
  }

  const subtotal = calcularSubtotal(carrito);

  if (promocion.tipo === 'porcentaje') {
    return Math.round(subtotal * promocion.valor / 100);
  }

  if (promocion.tipo === 'dosPorUno') {
    // Una lista con el precio de cada vinilo suelto, del más barato al más caro.
    const precios = [];
    carrito.forEach(function (producto) {
      for (let i = 0; i < producto.cantidad; i++) {
        precios.push(producto.precio);
      }
    });
    precios.sort(function (a, b) { return a - b; });

    // Por cada par, el más barato sale gratis: se suman los más baratos de la lista.
    const pares = Math.floor(precios.length / 2);
    return precios.slice(0, pares).reduce(function (suma, precio) {
      return suma + precio;
    }, 0);
  }

  return 0;
}
