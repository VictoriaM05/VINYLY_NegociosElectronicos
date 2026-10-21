(function () {
  'use strict';

  const clavePublicaciones = 'publicacionesVinyly';
  const prefijoImagenValido = 'data:image/';

  function esObjeto(valor) {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
  }

  function normalizarPublicacion(publicacion) {
    if (
      !esObjeto(publicacion) ||
      typeof publicacion.id !== 'string' ||
      typeof publicacion.nombre !== 'string'
    ) {
      return null;
    }

    return {
      id: publicacion.id,
      nombre: publicacion.nombre,
      artista: typeof publicacion.artista === 'string' ? publicacion.artista : '',
      precio: typeof publicacion.precio === 'number' &&
        Number.isFinite(publicacion.precio) &&
        publicacion.precio > 0
        ? publicacion.precio
        : null,
      descripcion: typeof publicacion.descripcion === 'string' ? publicacion.descripcion : '',
      foto: typeof publicacion.foto === 'string' &&
        (publicacion.foto === '' || publicacion.foto.indexOf(prefijoImagenValido) === 0)
        ? publicacion.foto
        : '',
      fecha: typeof publicacion.fecha === 'string' ? publicacion.fecha : ''
    };
  }

  function leerPublicaciones() {
    try {
      const datos = window.localStorage.getItem(clavePublicaciones);
      const publicaciones = JSON.parse(datos || '[]');
      if (!Array.isArray(publicaciones)) {
        return [];
      }

      return publicaciones.map(normalizarPublicacion).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function guardarPublicaciones(publicaciones) {
    try {
      window.localStorage.setItem(clavePublicaciones, JSON.stringify(publicaciones));
      return { persistido: true };
    } catch (error) {
      return { persistido: false };
    }
  }

  function crearIdPublicacion() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function agregarPublicacion(datos) {
    const nuevaPublicacion = {
      id: crearIdPublicacion(),
      nombre: datos.nombre,
      artista: datos.artista || '',
      precio: typeof datos.precio === 'number' && Number.isFinite(datos.precio) && datos.precio > 0
        ? datos.precio
        : null,
      descripcion: datos.descripcion || '',
      foto: typeof datos.foto === 'string' && datos.foto.indexOf(prefijoImagenValido) === 0
        ? datos.foto
        : '',
      fecha: new Date().toISOString()
    };
    const publicaciones = leerPublicaciones();
    publicaciones.push(nuevaPublicacion);
    const resultado = guardarPublicaciones(publicaciones);

    return {
      publicacion: nuevaPublicacion,
      publicaciones: publicaciones,
      persistido: resultado.persistido
    };
  }

  function eliminarPublicacion(id, publicacionesActuales) {
    const publicaciones = Array.isArray(publicacionesActuales)
      ? publicacionesActuales.slice()
      : leerPublicaciones();
    const filtradas = publicaciones.filter(function (publicacion) {
      return publicacion.id !== id;
    });
    const eliminada = filtradas.length !== publicaciones.length;
    const resultado = eliminada
      ? guardarPublicaciones(filtradas)
      : { persistido: true };

    return {
      eliminada: eliminada,
      publicaciones: filtradas,
      persistido: resultado.persistido
    };
  }

  function formatearPrecio(precio) {
    if (precio === null || typeof precio !== 'number' || !Number.isFinite(precio)) {
      return 'Precio a convenir';
    }

    const opciones = Number.isInteger(precio)
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return `$${precio.toLocaleString('es-MX', opciones)} MXN`;
  }

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    if (Number.isNaN(fecha.getTime())) {
      return 'Fecha no disponible';
    }

    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function procesarFoto(archivo) {
    return new Promise(function (resolve, reject) {
      if (!archivo || typeof archivo.type !== 'string' || archivo.type.indexOf('image/') !== 0) {
        reject(new Error('El archivo seleccionado no es una imagen.'));
        return;
      }

      const lector = new FileReader();
      lector.onerror = function () {
        reject(new Error('No se pudo leer la imagen.'));
      };
      lector.onload = function () {
        const imagen = new Image();
        imagen.onerror = function () {
          reject(new Error('No se pudo procesar la imagen.'));
        };
        imagen.onload = function () {
          try {
            const ladoMayor = Math.max(imagen.naturalWidth, imagen.naturalHeight);
            if (!ladoMayor) {
              reject(new Error('La imagen no tiene dimensiones válidas.'));
              return;
            }

            const escala = Math.min(1, 640 / ladoMayor);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(imagen.naturalWidth * escala));
            canvas.height = Math.max(1, Math.round(imagen.naturalHeight * escala));
            const contexto = canvas.getContext('2d');
            if (!contexto) {
              reject(new Error('No se pudo procesar la imagen.'));
              return;
            }

            contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } catch (error) {
            reject(error);
          }
        };
        imagen.src = lector.result;
      };
      lector.readAsDataURL(archivo);
    });
  }

  window.PublicacionesVinyly = {
    leerPublicaciones: leerPublicaciones,
    guardarPublicaciones: guardarPublicaciones,
    agregarPublicacion: agregarPublicacion,
    eliminarPublicacion: eliminarPublicacion,
    formatearPrecio: formatearPrecio,
    formatearFecha: formatearFecha,
    procesarFoto: procesarFoto
  };
}());
