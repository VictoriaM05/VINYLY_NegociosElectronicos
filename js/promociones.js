// tipo 'porcentaje': "valor" es el % que se descuenta del subtotal.
// tipo 'dosPorUno': por cada par de vinilos, el más barato sale gratis.
const CLAVE_PROMOCIONES = 'promocionesVinyly';
const CLAVE_DESCUENTO = 'descuentoVinyly';
const ICONOS_PROMOCION = Object.freeze(['🎧', '💿', '🎁', '🔥', '⭐', '🏷️', '🎵', '✨']);
const ESTADOS_PROMOCION = Object.freeze({
  activa: 'Activa',
  pausada: 'Pausada',
  programada: 'Programada',
  finalizada: 'Finalizada'
});
const TIPOS_PROMOCION = Object.freeze({
  porcentaje: 'Porcentaje',
  dosPorUno: '2x1',
  montoFijo: 'Monto fijo'
});

window.ESTADOS_PROMOCION = ESTADOS_PROMOCION;
window.TIPOS_PROMOCION = TIPOS_PROMOCION;

const PROMOCIONES_INICIALES = [
  {
    id: 'POP10',
    codigo: 'POP10',
    icono: '🎧',
    titulo: 'Pop de temporada',
    descripcion: '10% de descuento en todo tu pedido.',
    tipo: 'porcentaje',
    valor: 10,
    estado: 'activa',
    vigencia: '2026-12-31'
  },
  {
    id: 'VINYLY15',
    codigo: 'VINYLY15',
    icono: '💿',
    titulo: 'Vinilo de bienvenida',
    descripcion: '15% de descuento para tu primera compra.',
    tipo: 'porcentaje',
    valor: 15,
    estado: 'activa',
    vigencia: '2027-01-15'
  },
  {
    id: 'VINYL2X1',
    codigo: 'VINYL2X1',
    icono: '🎁',
    titulo: '2x1 en vinilos',
    descripcion: 'Lleva dos vinilos y paga solo el más caro.',
    tipo: 'dosPorUno',
    valor: 0,
    estado: 'activa',
    vigencia: '2026-12-31'
  },
  {
    id: 'CLASICOS20',
    codigo: 'CLASICOS20',
    icono: '⭐',
    titulo: 'Semana de clásicos',
    descripcion: '20% de descuento en clásicos seleccionados.',
    tipo: 'porcentaje',
    valor: 20,
    estado: 'finalizada',
    vigencia: '2026-09-20'
  },
  {
    id: 'ENVIOGRATIS',
    codigo: 'ENVIOGRATIS',
    icono: '🏷️',
    titulo: 'Envío de colección',
    descripcion: 'Bonificación de $100 en tu envío',
    tipo: 'montoFijo',
    valor: 100,
    estado: 'programada',
    vigencia: '2026-12-05'
  }
];

function esFechaCalendarioValida(fecha) {
  const coincidencia = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(fecha);
  if (!coincidencia) {
    return false;
  }

  const anio = Number(coincidencia[1]);
  const mes = Number(coincidencia[2]);
  const dia = Number(coincidencia[3]);
  const bisiesto = anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);
  const diasPorMes = [31, bisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return anio > 0 && mes >= 1 && mes <= 12 && dia >= 1 && dia <= diasPorMes[mes - 1];
}

function normalizarPromocion(promocion) {
  if (!promocion || typeof promocion !== 'object' || Array.isArray(promocion)) {
    return null;
  }

  const id = typeof promocion.id === 'string' ? promocion.id.trim() : '';
  const codigo = typeof promocion.codigo === 'string'
    ? promocion.codigo.trim().toUpperCase()
    : '';
  const titulo = typeof promocion.titulo === 'string' ? promocion.titulo.trim().slice(0, 40) : '';
  const descripcion = typeof promocion.descripcion === 'string'
    ? promocion.descripcion.trim().slice(0, 120)
    : '';

  if (!id || !/^[A-Z0-9]{3,20}$/.test(codigo) || !titulo) {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(TIPOS_PROMOCION, promocion.tipo)) {
    return null;
  }

  let valor;
  if (promocion.tipo === 'porcentaje') {
    if (typeof promocion.valor !== 'number' || !Number.isFinite(promocion.valor)) {
      return null;
    }
    valor = Math.round(promocion.valor);
    if (valor < 1 || valor > 100) {
      return null;
    }
  } else if (promocion.tipo === 'montoFijo') {
    if (typeof promocion.valor !== 'number' || !Number.isFinite(promocion.valor)) {
      return null;
    }
    valor = Math.round(promocion.valor * 100) / 100;
    if (valor < 0.01 || valor > 99999.99) {
      return null;
    }
  } else {
    valor = 0;
  }

  const estado = Object.prototype.hasOwnProperty.call(ESTADOS_PROMOCION, promocion.estado)
    ? promocion.estado
    : 'pausada';
  const vigencia = typeof promocion.vigencia === 'string'
    && esFechaCalendarioValida(promocion.vigencia)
    ? promocion.vigencia
    : '';

  return {
    id: id,
    codigo: codigo,
    titulo: titulo,
    descripcion: descripcion,
    tipo: promocion.tipo,
    valor: valor,
    icono: ICONOS_PROMOCION.includes(promocion.icono) ? promocion.icono : '🏷️',
    estado: estado,
    vigencia: vigencia
  };
}

function normalizarListaPromociones(lista) {
  const promociones = [];
  const ids = new Set();
  const codigos = new Set();

  lista.forEach(function (elemento) {
    const promocion = normalizarPromocion(elemento);
    if (!promocion || ids.has(promocion.id) || codigos.has(promocion.codigo)) {
      return;
    }

    ids.add(promocion.id);
    codigos.add(promocion.codigo);
    promociones.push(promocion);
  });

  return promociones;
}

function leerPromociones() {
  try {
    const contenido = localStorage.getItem(CLAVE_PROMOCIONES);
    if (contenido === null) {
      return normalizarListaPromociones(PROMOCIONES_INICIALES);
    }

    const lista = JSON.parse(contenido);
    return Array.isArray(lista)
      ? normalizarListaPromociones(lista)
      : normalizarListaPromociones(PROMOCIONES_INICIALES);
  } catch (error) {
    return normalizarListaPromociones(PROMOCIONES_INICIALES);
  }
}

function leerPromocionesActivas() {
  return leerPromociones()
    .filter(function (promocion) { return promocion.estado === 'activa'; })
    .map(function (promocion) { return Object.assign({}, promocion); });
}

function guardarPromociones(lista) {
  if (!Array.isArray(lista)) {
    return false;
  }

  const promociones = normalizarListaPromociones(lista);
  if (promociones.length !== lista.length) {
    return false;
  }

  try {
    localStorage.setItem(CLAVE_PROMOCIONES, JSON.stringify(promociones));
    return true;
  } catch (error) {
    return false;
  }
}

function restablecerPromociones() {
  try {
    localStorage.removeItem(CLAVE_PROMOCIONES);
    return true;
  } catch (error) {
    return false;
  }
}

function etiquetaPromocion(promocion) {
  if (!promocion || !Object.prototype.hasOwnProperty.call(TIPOS_PROMOCION, promocion.tipo)) {
    return '';
  }
  if (promocion.tipo === 'porcentaje') {
    return String(promocion.valor) + '%';
  }
  if (promocion.tipo === 'dosPorUno') {
    return '2x1';
  }

  return '$' + String(Number(promocion.valor.toFixed(2))).replace(/\.0+$/, '');
}

function formatearVigencia(promocion) {
  if (!promocion || typeof promocion.vigencia !== 'string'
      || !esFechaCalendarioValida(promocion.vigencia)) {
    return '';
  }

  const partes = promocion.vigencia.split('-').map(Number);
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
  if (partes[0] < 100) {
    fecha.setFullYear(partes[0]);
  }
  const fechaTexto = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(fecha);

  return 'Válida hasta ' + fechaTexto;
}

// Busca una promoción por su código (sin importar mayúsculas ni espacios).
function buscarPromocion(codigo) {
  const codigoLimpio = String(codigo || '').trim().toUpperCase();
  return leerPromocionesActivas().find(function (promo) {
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
  try {
    localStorage.setItem(CLAVE_DESCUENTO, promocion.codigo);
  } catch (error) {
    return;
  }
}

function quitarDescuento() {
  try {
    localStorage.removeItem(CLAVE_DESCUENTO);
  } catch (error) {
    return;
  }
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

  if (promocion.tipo === 'montoFijo') {
    return Math.max(0, Math.min(promocion.valor, subtotal));
  }

  return 0;
}
