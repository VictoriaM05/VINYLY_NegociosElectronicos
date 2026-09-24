const CLAVE_CARRITO = 'carritoVinyly';

// Convierte precios como "$420 MXN" en un número usable para los totales.
function convertirPrecioANumero(precio) {
  if (typeof precio === 'number') {
    return precio;
  }

  const precioLimpio = String(precio || '')
    .replace(/\$/g, '')
    .replace(/MXN/gi, '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const valor = Number(precioLimpio.replace(/[^\d.-]/g, ''));
  return Number.isFinite(valor) ? valor : 0;
}

// Lee el carrito guardado y devuelve un arreglo listo para usar.
function obtenerCarrito() {
  try {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);
    const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    return [];
  }
}

// Guarda el arreglo actual del carrito en el navegador.
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Crea la versión mínima del producto que se conservará en el carrito.
function prepararProductoParaCarrito(producto) {
  const productoCarrito = {
    id: producto.id,
    nombre: producto.nombre,
    artista: producto.artista,
    precio: convertirPrecioANumero(producto.precio),
    cantidad: 1
  };

  if (producto.imagen) {
    productoCarrito.imagen = producto.imagen;
  }

  if (producto.foto) {
    productoCarrito.foto = producto.foto;
  }

  return productoCarrito;
}

// Agrega un producto o suma su cantidad si ya estaba en el carrito.
function agregarAlCarrito(producto, cantidad) {
  const carrito = obtenerCarrito();
  const cantidadAgregar = Math.max(1, Number(cantidad) || 1);
  const productoExistente = carrito.find(function (item) {
    return item.id === producto.id;
  });

  if (productoExistente) {
    productoExistente.cantidad += cantidadAgregar;
  } else {
    const productoCarrito = prepararProductoParaCarrito(producto);
    productoCarrito.cantidad = cantidadAgregar;
    carrito.push(productoCarrito);
  }

  guardarCarrito(carrito);
  return carrito;
}

// Elimina por completo un producto usando su id.
function quitarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(function (producto) {
    return producto.id !== Number(id);
  });

  guardarCarrito(carrito);
  return carrito;
}

// Actualiza la cantidad de un producto sin permitir valores menores a 1.
function cambiarCantidad(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const producto = carrito.find(function (item) {
    return item.id === Number(id);
  });

  if (producto) {
    producto.cantidad = Math.max(1, Number(nuevaCantidad) || 1);
    guardarCarrito(carrito);
  }

  return carrito;
}
