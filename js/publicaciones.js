(function () {
  'use strict';

  const clavePublicaciones = 'publicacionesVinyly';
  const prefijoImagenValido = 'data:image/';
  const publicacionesEjemplo = Object.freeze([
    Object.freeze({
      id: 'demo-1',
      nombre: '1989 (usado, en excelente estado)',
      artista: 'Taylor Swift',
      precio: 820,
      descripcion: 'Una edición muy bien conservada, con portada y disco en excelente estado. Lista para encontrar otra colección.',
      autor: 'Valeria R.',
      fecha: '2026-10-15T12:00:00.000Z',
      foto: 'resources/1989_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-2',
      nombre: 'Starboy (edición sellada)',
      artista: 'The Weeknd',
      precio: 780,
      descripcion: 'Edición sellada, ideal para quien busca sumar este álbum a su colección.',
      autor: 'Diego M.',
      fecha: '2026-10-14T12:00:00.000Z',
      foto: 'resources/starboy_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-3',
      nombre: 'Born This Way (usado, muy bien cuidado)',
      artista: 'Lady Gaga',
      precio: 950,
      descripcion: 'Vinilo usado y bien cuidado, con gran sonido. La portada está en muy buen estado.',
      autor: 'Fernanda C.',
      fecha: '2026-10-13T12:00:00.000Z',
      foto: 'resources/bornthisway_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-4',
      nombre: "Short n' Sweet (edición sellada)",
      artista: 'Sabrina Carpenter',
      precio: 600,
      descripcion: 'Edición sellada para disfrutar este álbum en vinilo o sumar a una colección pop.',
      autor: 'Luis A.',
      fecha: '2026-10-12T12:00:00.000Z',
      foto: 'resources/shortnsweet_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-5',
      nombre: 'BRAT (usado, en excelente estado)',
      artista: 'Charli XCX',
      precio: 620,
      descripcion: 'Disco usado, limpio y en excelente estado. Se entrega con su funda original.',
      autor: 'Mariana G.',
      fecha: '2026-10-11T12:00:00.000Z',
      foto: 'resources/brat_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-6',
      nombre: 'Purpose (Deluxe, usado)',
      artista: 'Justin Bieber',
      precio: 760,
      descripcion: 'Edición Deluxe usada y bien conservada. Una buena oportunidad para fans del pop.',
      autor: 'José R.',
      fecha: '2026-10-10T12:00:00.000Z',
      foto: 'resources/purpose_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-7',
      nombre: 'Romance (usado, cuidado)',
      artista: 'Camila Cabello',
      precio: 700,
      descripcion: 'Vinilo usado y cuidado, con portada en buen estado. Perfecto para escuchar de principio a fin.',
      autor: 'Andrea L.',
      fecha: '2026-10-09T12:00:00.000Z',
      foto: 'resources/romance_disco.jpg'
    }),
    Object.freeze({
      id: 'demo-8',
      nombre: 'ANTI (Deluxe, edición sellada)',
      artista: 'Rihanna',
      precio: 650,
      descripcion: 'Edición Deluxe sellada para quienes buscan este álbum en su colección.',
      autor: 'Miguel T.',
      fecha: '2026-10-08T12:00:00.000Z',
      foto: 'resources/anti(deluxe)_disco.jpg'
    })
  ]);

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
      autor: typeof publicacion.autor === 'string' ? publicacion.autor.trim().slice(0, 40) : '',
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
      fecha: typeof publicacion.fecha === 'string' ? publicacion.fecha : '',
      editadaEn: esFechaISO(publicacion.editadaEn) ? publicacion.editadaEn : ''
    };
  }

  function esFechaISO(fecha) {
    if (typeof fecha !== 'string') {
      return false;
    }

    const partes = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(fecha);
    if (!partes || !Number.isFinite(Date.parse(fecha))) {
      return false;
    }

    const fechaCalendario = new Date(0);
    fechaCalendario.setUTCFullYear(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
    fechaCalendario.setUTCHours(Number(partes[4]), Number(partes[5]), Number(partes[6]), 0);

    return fechaCalendario.getUTCFullYear() === Number(partes[1]) &&
      fechaCalendario.getUTCMonth() === Number(partes[2]) - 1 &&
      fechaCalendario.getUTCDate() === Number(partes[3]) &&
      Number(partes[4]) <= 23 &&
      Number(partes[5]) <= 59 &&
      Number(partes[6]) <= 59 &&
      (!partes[7] || (Number(partes[8]) <= 23 && Number(partes[9]) <= 59));
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
      autor: typeof datos.autor === 'string' ? datos.autor.trim().slice(0, 40) : '',
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

  function obtenerPublicacion(id) {
    if (typeof id !== 'string' || id.indexOf('demo-') === 0) {
      return null;
    }

    const publicacion = leerPublicaciones().find(function (item) {
      return item.id === id;
    });
    return publicacion ? Object.assign({}, publicacion) : null;
  }

  function actualizarPublicacion(id, datos) {
    const resultadoBase = {
      encontrada: false,
      actualizada: false,
      persistido: false,
      publicacion: null
    };

    try {
      if (
        typeof id !== 'string' ||
        id.indexOf('demo-') === 0 ||
        !esObjeto(datos)
      ) {
        return resultadoBase;
      }

      const publicaciones = leerPublicaciones();
      const indice = publicaciones.findIndex(function (publicacion) {
        return publicacion.id === id;
      });
      if (indice === -1) {
        return resultadoBase;
      }

      const original = publicaciones[indice];
      const actualizada = {
        id: original.id,
        nombre: typeof datos.nombre === 'string' ? datos.nombre : '',
        artista: typeof datos.artista === 'string' ? datos.artista : '',
        autor: typeof datos.autor === 'string' ? datos.autor.trim().slice(0, 40) : '',
        precio: typeof datos.precio === 'number' &&
          Number.isFinite(datos.precio) &&
          datos.precio > 0
          ? datos.precio
          : null,
        descripcion: typeof datos.descripcion === 'string' ? datos.descripcion : '',
        foto: typeof datos.foto === 'string' &&
          (datos.foto === '' || datos.foto.indexOf(prefijoImagenValido) === 0)
          ? datos.foto
          : '',
        fecha: original.fecha,
        editadaEn: new Date().toISOString()
      };
      publicaciones[indice] = actualizada;
      const guardado = guardarPublicaciones(publicaciones);

      return {
        encontrada: true,
        actualizada: true,
        persistido: guardado.persistido,
        publicacion: Object.assign({}, actualizada)
      };
    } catch (error) {
      return resultadoBase;
    }
  }

  function eliminarPublicacion(id, publicacionesActuales) {
    const publicaciones = Array.isArray(publicacionesActuales)
      ? publicacionesActuales.slice()
      : leerPublicaciones();
    if (typeof id === 'string' && id.indexOf('demo-') === 0) {
      return {
        eliminada: false,
        publicaciones: publicaciones,
        persistido: true
      };
    }

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

  function resolverAutor(nombre) {
    const autor = typeof nombre === 'string' ? nombre.trim() : '';
    return autor || 'Anónimo';
  }

  function obtenerIniciales(nombre) {
    return (typeof nombre === 'string' ? nombre : '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (parte) {
        return parte.charAt(0).toLocaleUpperCase('es-MX');
      })
      .join('');
  }

  function obtenerColorAvatar(nombre) {
    const sumaLetras = Array.from(typeof nombre === 'string' ? nombre : '').reduce(function (suma, letra) {
      return suma + (letra.codePointAt(0) || 0);
    }, 0);
    return ['morado', 'rosa', 'dorado', 'turquesa'][sumaLetras % 4];
  }

  function leerMarketplace() {
    const ejemplos = publicacionesEjemplo.map(function (publicacion) {
      return {
        id: publicacion.id,
        nombre: publicacion.nombre,
        artista: publicacion.artista,
        precio: publicacion.precio,
        descripcion: publicacion.descripcion,
        autor: resolverAutor(publicacion.autor),
        fecha: publicacion.fecha,
        editadaEn: '',
        foto: publicacion.foto,
        esMia: false
      };
    });
    const propias = leerPublicaciones().map(function (publicacion) {
      return {
        id: publicacion.id,
        nombre: publicacion.nombre,
        artista: publicacion.artista,
        precio: publicacion.precio,
        descripcion: publicacion.descripcion,
        autor: resolverAutor(publicacion.autor),
        fecha: publicacion.fecha,
        editadaEn: publicacion.editadaEn,
        foto: publicacion.foto,
        esMia: true
      };
    });

    return ejemplos.concat(propias).sort(function (a, b) {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });
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
    resolverAutor: resolverAutor,
    obtenerIniciales: obtenerIniciales,
    obtenerColorAvatar: obtenerColorAvatar,
    leerMarketplace: leerMarketplace,
    guardarPublicaciones: guardarPublicaciones,
    agregarPublicacion: agregarPublicacion,
    obtenerPublicacion: obtenerPublicacion,
    actualizarPublicacion: actualizarPublicacion,
    eliminarPublicacion: eliminarPublicacion,
    formatearPrecio: formatearPrecio,
    formatearFecha: formatearFecha,
    procesarFoto: procesarFoto
  };
}());
