const productosAdmin = productos.map(function (producto) {
  return { ...producto };
});

let productoEnEdicion = null;
let siguienteIdProducto = Math.max(...productosAdmin.map(function (producto) {
  return producto.id;
})) + 1;

const tablaProductos = document.getElementById('products-table-body');
const formularioProducto = document.getElementById('product-form');
const panelFormularioProducto = document.getElementById('product-form-panel');
const tituloFormularioProducto = document.getElementById('product-form-title');
const mensajeProductos = document.getElementById('product-feedback');

function formatearPrecio(precio) {
  const importe = Number(String(precio).replace(/[^\d.]/g, ''));
  return Number.isFinite(importe)
    ? '$' + importe.toLocaleString('es-MX') + ' MXN'
    : String(precio);
}

function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto || '—';
  return celda;
}

function renderizarProductos() {
  tablaProductos.replaceChildren();

  productosAdmin.forEach(function (producto) {
    const fila = document.createElement('tr');
    fila.append(
      crearCelda(producto.nombre),
      crearCelda(producto.artista),
      crearCelda(formatearPrecio(producto.precio))
    );

    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'admin-table-actions';

    const botonEditar = document.createElement('button');
    botonEditar.className = 'admin-row-action';
    botonEditar.type = 'button';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', function () {
      abrirFormulario(producto);
    });

    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'admin-row-action admin-row-delete';
    botonEliminar.type = 'button';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', function () {
      if (window.confirm('¿Seguro que quieres eliminar ' + producto.nombre + '?')) {
        productosAdmin.splice(productosAdmin.indexOf(producto), 1);
        renderizarProductos();
        mensajeProductos.textContent = producto.nombre + ' se quitó de esta vista.';
      }
    });

    celdaAcciones.append(botonEditar, botonEliminar);
    fila.append(celdaAcciones);
    tablaProductos.append(fila);
  });
}

function abrirFormulario(producto) {
  productoEnEdicion = producto ? producto.id : null;
  formularioProducto.reset();
  tituloFormularioProducto.textContent = producto ? 'Editar producto' : 'Agregar producto';
  formularioProducto.elements.nombre.value = producto ? producto.nombre : '';
  formularioProducto.elements.artista.value = producto ? producto.artista : '';
  formularioProducto.elements.precio.value = producto
    ? String(producto.precio).replace(/[^\d.]/g, '')
    : '';
  formularioProducto.elements.descripcion.value = producto ? producto.descripcion || '' : '';
  mensajeProductos.textContent = '';
  panelFormularioProducto.hidden = false;
  formularioProducto.elements.nombre.focus();
}

function cerrarFormulario() {
  panelFormularioProducto.hidden = true;
  formularioProducto.reset();
  productoEnEdicion = null;
}

document.getElementById('add-product-button').addEventListener('click', function () {
  abrirFormulario(null);
});

document.getElementById('cancel-product-button').addEventListener('click', cerrarFormulario);

formularioProducto.addEventListener('submit', function (event) {
  event.preventDefault();

  const datos = new FormData(formularioProducto);
  const nombre = String(datos.get('nombre')).trim();
  const artista = String(datos.get('artista')).trim();
  const precio = Number(datos.get('precio'));
  const descripcion = String(datos.get('descripcion')).trim();

  if (productoEnEdicion !== null) {
    const producto = productosAdmin.find(function (elemento) {
      return elemento.id === productoEnEdicion;
    });
    Object.assign(producto, { nombre, artista, precio, descripcion });
    mensajeProductos.textContent = nombre + ' se actualizó en esta vista.';
  } else {
    productosAdmin.push({
      id: siguienteIdProducto++,
      nombre,
      artista,
      precio,
      descripcion,
      imagen: '',
      foto: ''
    });
    mensajeProductos.textContent = nombre + ' se agregó a esta vista.';
  }

  renderizarProductos();
  cerrarFormulario();
});

renderizarProductos();