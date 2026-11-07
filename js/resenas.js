(function () {
  'use strict';

  // Coincide con el nombre que se muestra en el perfil.
  const NOMBRE_USUARIO = 'Pedrito Vinilo';
  const CLAVE_RESENAS = 'resenasVinyly';
  const MAX_CARACTERES = 300;
  const resenasEjemplo = [
    { id: 'ejemplo-1-1', productoId: 1, estrellas: 5, texto: 'Los sintetizadores y los coros suenan muy claros; gran disco para escuchar completo.', fecha: '2026-10-28T15:00:00.000Z', editadaEn: '', autor: 'Valeria R.' },
    { id: 'ejemplo-1-2', productoId: 1, estrellas: 4, texto: 'La edición está bonita y el lado A se escucha muy bien en casa.', fecha: '2026-10-19T13:00:00.000Z', editadaEn: '', autor: 'Diego M.' },
    { id: 'ejemplo-2-1', productoId: 2, estrellas: 5, texto: 'Los bajos de Starboy tienen mucha presencia y el disco llegó en buen estado.', fecha: '2026-10-30T16:00:00.000Z', editadaEn: '', autor: 'Camila S.' },
    { id: 'ejemplo-2-2', productoId: 2, estrellas: 3, texto: 'Me gusta el álbum; en mi equipo algunas canciones se oyen un poco más bajas.', fecha: '2026-10-17T12:00:00.000Z', editadaEn: '', autor: 'Luis A.' },
    { id: 'ejemplo-3-1', productoId: 3, estrellas: 4, texto: 'La energía del álbum se disfruta mucho en vinilo, sobre todo en el lado B.', fecha: '2026-10-29T14:00:00.000Z', editadaEn: '', autor: 'Fernanda C.' },
    { id: 'ejemplo-3-2', productoId: 3, estrellas: 5, texto: 'Portada preciosa y sonido potente. Un clásico que tenía pendiente en mi colección.', fecha: '2026-10-20T11:00:00.000Z', editadaEn: '', autor: 'Mariana G.' },
    { id: 'ejemplo-4-1', productoId: 4, estrellas: 5, texto: 'Las voces se sienten muy cercanas y los coros suenan increíbles en este formato.', fecha: '2026-11-02T17:00:00.000Z', editadaEn: '', autor: 'Andrea L.' },
    { id: 'ejemplo-4-2', productoId: 4, estrellas: 4, texto: 'Muy buena edición; el empaque llegó cuidado y el disco se ve precioso.', fecha: '2026-10-22T10:00:00.000Z', editadaEn: '', autor: 'José R.' },
    { id: 'ejemplo-5-1', productoId: 5, estrellas: 4, texto: 'Un pop muy divertido y la portada rosa luce genial junto a mis otros discos.', fecha: '2026-10-27T18:00:00.000Z', editadaEn: '', autor: 'Valeria R.' },
    { id: 'ejemplo-5-2', productoId: 5, estrellas: 3, texto: 'Me trae muchos recuerdos. Mi copia tiene un poco de ruido al inicio, pero se disfruta.', fecha: '2026-10-16T15:00:00.000Z', editadaEn: '', autor: 'Diego M.' },
    { id: 'ejemplo-6-1', productoId: 6, estrellas: 5, texto: 'Los temas mantienen toda su energía y el vinilo llegó en excelentes condiciones.', fecha: '2026-11-01T12:00:00.000Z', editadaEn: '', autor: 'Camila S.' },
    { id: 'ejemplo-6-2', productoId: 6, estrellas: 4, texto: 'Edición muy llamativa, perfecta para ponerla con amigos el fin de semana.', fecha: '2026-10-21T16:00:00.000Z', editadaEn: '', autor: 'Luis A.' },
    { id: 'ejemplo-7-1', productoId: 7, estrellas: 4, texto: 'La producción tiene muchos detalles y el formato Deluxe se siente completo.', fecha: '2026-10-31T14:00:00.000Z', editadaEn: '', autor: 'Fernanda C.' },
    { id: 'ejemplo-7-2', productoId: 7, estrellas: 5, texto: 'Un álbum que suena muy bien de principio a fin; llegó perfectamente empacado.', fecha: '2026-10-18T17:00:00.000Z', editadaEn: '', autor: 'Mariana G.' },
    { id: 'ejemplo-8-1', productoId: 8, estrellas: 5, texto: 'Tiene ese sonido pop-rock que no cansa. Me encantó volver a escucharlo en vinilo.', fecha: '2026-10-26T13:00:00.000Z', editadaEn: '', autor: 'Andrea L.' },
    { id: 'ejemplo-8-2', productoId: 8, estrellas: 3, texto: 'Buen álbum y buena presentación; esperaba un poco más de volumen en algunas pistas.', fecha: '2026-10-15T11:00:00.000Z', editadaEn: '', autor: 'José R.' },
    { id: 'ejemplo-9-1', productoId: 9, estrellas: 4, texto: 'Las canciones acústicas tienen mucha calidez y la edición luce muy bien.', fecha: '2026-10-25T16:00:00.000Z', editadaEn: '', autor: 'Valeria R.' },
    { id: 'ejemplo-9-2', productoId: 9, estrellas: 5, texto: 'Un disco ideal para escuchar tranquilo. La funda llegó sin ningún detalle.', fecha: '2026-10-14T13:00:00.000Z', editadaEn: '', autor: 'Diego M.' },
    { id: 'ejemplo-10-1', productoId: 10, estrellas: 5, texto: 'Thriller suena espectacular; cada lado tiene canciones que son puro clásico.', fecha: '2026-11-03T13:00:00.000Z', editadaEn: '', autor: 'Camila S.' },
    { id: 'ejemplo-10-2', productoId: 10, estrellas: 4, texto: 'Muy buena pieza para la colección, con una presentación que se disfruta mucho.', fecha: '2026-10-23T15:00:00.000Z', editadaEn: '', autor: 'Luis A.' },
    { id: 'ejemplo-11-1', productoId: 11, estrellas: 4, texto: 'Las armonías vocales se aprecian mucho y el álbum tiene muy buen ritmo.', fecha: '2026-10-24T12:00:00.000Z', editadaEn: '', autor: 'Fernanda C.' },
    { id: 'ejemplo-11-2', productoId: 11, estrellas: 3, texto: 'Me gustan varias canciones; el sonido de mi copia es correcto y sin problemas.', fecha: '2026-10-13T16:00:00.000Z', editadaEn: '', autor: 'Mariana G.' },
    { id: 'ejemplo-12-1', productoId: 12, estrellas: 5, texto: 'Poner Spice en la tornamesa es pura nostalgia, y la edición llegó impecable.', fecha: '2026-10-30T12:00:00.000Z', editadaEn: '', autor: 'Andrea L.' },
    { id: 'ejemplo-12-2', productoId: 12, estrellas: 4, texto: 'Un pop muy alegre; la portada se ve increíble en el estante.', fecha: '2026-10-12T14:00:00.000Z', editadaEn: '', autor: 'José R.' },
    { id: 'ejemplo-13-1', productoId: 13, estrellas: 5, texto: 'Los toques latinos y las baladas se sienten muy bien juntos en este álbum.', fecha: '2026-10-29T17:00:00.000Z', editadaEn: '', autor: 'Valeria R.' },
    { id: 'ejemplo-13-2', productoId: 13, estrellas: 4, texto: 'Buena selección de canciones y una edición cuidada para disfrutar en casa.', fecha: '2026-10-11T13:00:00.000Z', editadaEn: '', autor: 'Diego M.' },
    { id: 'ejemplo-14-1', productoId: 14, estrellas: 5, texto: 'La voz de Rihanna destaca muchísimo; esta edición Deluxe es un gran hallazgo.', fecha: '2026-11-04T15:00:00.000Z', editadaEn: '', autor: 'Camila S.' },
    { id: 'ejemplo-14-2', productoId: 14, estrellas: 3, texto: 'Me gusta mucho el álbum. La funda llegó bien, aunque esperaba otro tipo de acabado.', fecha: '2026-10-20T14:00:00.000Z', editadaEn: '', autor: 'Luis A.' },
    { id: 'ejemplo-15-1', productoId: 15, estrellas: 4, texto: 'Un álbum muy personal; las canciones quedan perfectas para escucharlas de noche.', fecha: '2026-10-28T12:00:00.000Z', editadaEn: '', autor: 'Fernanda C.' },
    { id: 'ejemplo-15-2', productoId: 15, estrellas: 5, texto: 'La edición se escucha muy limpia y el arte del álbum se luce en grande.', fecha: '2026-10-10T16:00:00.000Z', editadaEn: '', autor: 'Mariana G.' }
  ];
  let resenas = [];
  let idsResenas = new Set();
  let inicializado = false;
  let contadorSelectores = 0;

  function esFechaISO(valor) {
    try {
      if (typeof valor !== 'string') {
        return false;
      }
      const partes = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(valor);
      if (!partes || !Number.isFinite(Date.parse(valor))) {
        return false;
      }

      const fecha = new Date(0);
      fecha.setUTCFullYear(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
      fecha.setUTCHours(Number(partes[4]), Number(partes[5]), Number(partes[6]), 0);
      return fecha.getUTCFullYear() === Number(partes[1]) &&
        fecha.getUTCMonth() === Number(partes[2]) - 1 &&
        fecha.getUTCDate() === Number(partes[3]) &&
        Number(partes[4]) <= 23 &&
        Number(partes[5]) <= 59 &&
        Number(partes[6]) <= 59 &&
        (!partes[7] || (Number(partes[8]) <= 23 && Number(partes[9]) <= 59));
    } catch (error) {
      return false;
    }
  }

  function crearId() {
    try {
      let id;
      do {
        id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      } while (idsResenas.has(id));
      return id;
    } catch (error) {
      return '';
    }
  }

  function copiar(resena) {
    try {
      return Object.assign({}, resena);
    } catch (error) {
      return null;
    }
  }

  function normalizar(datos) {
    try {
      if (!Array.isArray(datos)) {
        return [];
      }

      const resultado = [];
      const ids = new Set();
      const destinos = new Set();
      datos.forEach(function (dato) {
        try {
          if (!dato || typeof dato !== 'object' || Array.isArray(dato)) {
            return;
          }
          const productoValido = dato.productoId === null || Number.isInteger(dato.productoId);
          const fechaValida = esFechaISO(dato.fecha);
          const edicionValida = dato.editadaEn === '' || esFechaISO(dato.editadaEn);
          if (
            typeof dato.id !== 'string' ||
            !dato.id ||
            !productoValido ||
            !Number.isInteger(dato.estrellas) ||
            dato.estrellas < 1 ||
            dato.estrellas > 5 ||
            typeof dato.texto !== 'string' ||
            !fechaValida ||
            !edicionValida ||
            ids.has(dato.id)
          ) {
            return;
          }

          const destino = dato.productoId === null ? 'tienda' : `producto:${dato.productoId}`;
          if (destinos.has(destino)) {
            return;
          }

          ids.add(dato.id);
          destinos.add(destino);
          resultado.push({
            id: dato.id,
            productoId: dato.productoId,
            estrellas: dato.estrellas,
            texto: dato.texto.slice(0, MAX_CARACTERES),
            fecha: new Date(dato.fecha).toISOString(),
            editadaEn: dato.editadaEn ? new Date(dato.editadaEn).toISOString() : ''
          });
        } catch (error) {
          return;
        }
      });
      return resultado;
    } catch (error) {
      return [];
    }
  }

  function cargarDesdeStorage() {
    try {
      const datos = JSON.parse(window.localStorage.getItem(CLAVE_RESENAS) || '[]');
      resenas = normalizar(datos);
      idsResenas = new Set(resenas.map(function (resena) {
        return resena.id;
      }));
      inicializado = true;
    } catch (error) {
      if (!inicializado) {
        resenas = [];
        idsResenas = new Set();
        inicializado = true;
      }
    }
  }

  function asegurarInicializado() {
    try {
      if (!inicializado) {
        cargarDesdeStorage();
      }
    } catch (error) {
      inicializado = true;
    }
  }

  function persistir() {
    try {
      window.localStorage.setItem(CLAVE_RESENAS, JSON.stringify(resenas));
      return true;
    } catch (error) {
      return false;
    }
  }

  function notificarActualizacion() {
    try {
      window.dispatchEvent(new CustomEvent('resenas:actualizadas'));
    } catch (error) {
      return false;
    }
    return true;
  }

  function leerResenas() {
    try {
      asegurarInicializado();
      return resenas.map(copiar).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function obtenerResena(productoId) {
    try {
      asegurarInicializado();
      if (productoId !== null && !Number.isInteger(productoId)) {
        return null;
      }
      const resena = resenas.find(function (elemento) {
        return elemento.productoId === productoId;
      });
      return resena ? copiar(resena) : null;
    } catch (error) {
      return null;
    }
  }

  function guardarResena(datos) {
    try {
      asegurarInicializado();
      if (
        !datos ||
        typeof datos !== 'object' ||
        (datos.productoId !== null && !Number.isInteger(datos.productoId))
      ) {
        return { ok: false, mensaje: 'El destino de la reseña no es válido' };
      }
      if (!Number.isInteger(datos.estrellas) || datos.estrellas < 1 || datos.estrellas > 5) {
        return { ok: false, mensaje: 'Elige de 1 a 5 estrellas' };
      }
      if (typeof datos.texto !== 'string') {
        return { ok: false, mensaje: 'El comentario no es válido' };
      }

      const texto = datos.texto.slice(0, MAX_CARACTERES);
      const existente = resenas.find(function (resena) {
        return resena.productoId === datos.productoId;
      });
      let resena;
      if (existente) {
        existente.estrellas = datos.estrellas;
        existente.texto = texto;
        existente.editadaEn = new Date().toISOString();
        resena = existente;
      } else {
        const id = crearId();
        if (!id) {
          return { ok: false, mensaje: 'No se pudo crear la reseña', persistido: false };
        }
        resena = {
          id: id,
          productoId: datos.productoId,
          estrellas: datos.estrellas,
          texto: texto,
          fecha: new Date().toISOString(),
          editadaEn: ''
        };
        resenas.push(resena);
        idsResenas.add(id);
      }

      const persistido = persistir();
      notificarActualizacion();
      return { ok: true, persistido: persistido, resena: copiar(resena) };
    } catch (error) {
      return { ok: false, mensaje: 'No se pudo guardar la reseña', persistido: false };
    }
  }

  function eliminarResena(id) {
    try {
      asegurarInicializado();
      const indice = resenas.findIndex(function (resena) {
        return resena.id === id;
      });
      if (indice === -1) {
        return { ok: false, noExiste: true, persistido: false };
      }

      const eliminada = resenas.splice(indice, 1)[0];
      idsResenas.delete(eliminada.id);
      const persistido = persistir();
      notificarActualizacion();
      return { ok: true, persistido: persistido };
    } catch (error) {
      return { ok: false, mensaje: 'No se pudo eliminar la reseña', persistido: false };
    }
  }

  function contarResenas() {
    try {
      asegurarInicializado();
      return resenas.length;
    } catch (error) {
      return 0;
    }
  }

  function leerResenasDe(productoId) {
    try {
      if (!Number.isInteger(productoId)) {
        return [];
      }
      const propias = obtenerResena(productoId);
      const resultado = resenasEjemplo
        .filter(function (resena) {
          return resena.productoId === productoId;
        })
        .map(function (resena) {
          return Object.assign({}, resena, { esMia: false });
        });
      if (propias) {
        resultado.push(Object.assign({}, propias, {
          autor: NOMBRE_USUARIO,
          esMia: true
        }));
      }
      return resultado.sort(function (a, b) {
        return Date.parse(b.fecha) - Date.parse(a.fecha);
      });
    } catch (error) {
      return [];
    }
  }

  function resumenDe(productoId) {
    try {
      const resenasProducto = leerResenasDe(productoId);
      const distribucion = [5, 4, 3, 2, 1].map(function (estrellas) {
        return resenasProducto.filter(function (resena) {
          return resena.estrellas === estrellas;
        }).length;
      });
      const total = resenasProducto.length;
      const suma = resenasProducto.reduce(function (acumulado, resena) {
        return acumulado + resena.estrellas;
      }, 0);
      return {
        total: total,
        promedio: total ? Math.round((suma / total) * 10) / 10 : 0,
        distribucion: distribucion
      };
    } catch (error) {
      return { total: 0, promedio: 0, distribucion: [0, 0, 0, 0, 0] };
    }
  }

  function formatearFecha(iso) {
    try {
      if (!esFechaISO(iso)) {
        return '';
      }
      return new Date(iso).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  }

  function crearEstrellasLectura(valor, opciones) {
    try {
      const estrellas = Number.isFinite(valor) ? Math.min(5, Math.max(0, valor)) : 0;
      const contenedor = document.createElement('span');
      contenedor.className = 'resena-estrellas';
      if (opciones && typeof opciones.clase === 'string' && opciones.clase) {
        contenedor.classList.add(opciones.clase);
      }
      contenedor.setAttribute('role', 'img');
      contenedor.setAttribute('aria-label', `${estrellas} de 5 estrellas`);

      const base = document.createElement('span');
      base.className = 'resena-estrellas-base';
      base.setAttribute('aria-hidden', 'true');
      base.textContent = '★★★★★';

      const relleno = document.createElement('span');
      relleno.className = 'resena-estrellas-relleno';
      relleno.setAttribute('aria-hidden', 'true');
      relleno.textContent = '★★★★★';
      relleno.style.width = `${estrellas / 5 * 100}%`;

      contenedor.append(base, relleno);
      return contenedor;
    } catch (error) {
      return null;
    }
  }

  function crearSelectorEstrellas(datos) {
    try {
      contadorSelectores += 1;
      const nombre = datos && typeof datos.nombre === 'string' ? datos.nombre : 'calificacion';
      const prefijo = `resena-${nombre}-${contadorSelectores}`;
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'resena-selector';

      const leyenda = document.createElement('legend');
      leyenda.className = 'resena-selector-leyenda';
      leyenda.textContent = 'Tu calificación';

      const opciones = document.createElement('span');
      opciones.className = 'resena-opciones';
      for (let valor = 5; valor >= 1; valor -= 1) {
        const id = `${prefijo}-${valor}`;
        const radio = document.createElement('input');
        radio.className = 'resena-opcion-input';
        radio.type = 'radio';
        radio.name = prefijo;
        radio.id = id;
        radio.value = String(valor);
        if (datos && datos.valor === valor) {
          radio.checked = true;
        }

        const etiqueta = document.createElement('label');
        etiqueta.className = 'resena-opcion-etiqueta';
        etiqueta.htmlFor = id;
        etiqueta.setAttribute('aria-label', `${valor} ${valor === 1 ? 'estrella' : 'estrellas'}`);
        etiqueta.textContent = '★';

        opciones.append(radio, etiqueta);
      }
      fieldset.append(leyenda, opciones);

      return {
        elemento: fieldset,
        obtenerValor: function () {
          try {
            const seleccionado = fieldset.querySelector('.resena-opcion-input:checked');
            return seleccionado ? Number(seleccionado.value) : 0;
          } catch (error) {
            return 0;
          }
        },
        establecerValor: function (valor) {
          try {
            if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
              return false;
            }
            const radio = fieldset.querySelector(`.resena-opcion-input[value="${valor}"]`);
            if (!radio) {
              return false;
            }
            radio.checked = true;
            return true;
          } catch (error) {
            return false;
          }
        },
        limpiar: function () {
          try {
            fieldset.querySelectorAll('.resena-opcion-input').forEach(function (radio) {
              radio.checked = false;
            });
          } catch (error) {
            return false;
          }
          return true;
        }
      };
    } catch (error) {
      return {
        elemento: null,
        obtenerValor: function () { return 0; },
        establecerValor: function () { return false; },
        limpiar: function () { return false; }
      };
    }
  }

  try {
    window.addEventListener('storage', function (evento) {
      try {
        if (evento.key === CLAVE_RESENAS || evento.key === null) {
          cargarDesdeStorage();
        }
      } catch (error) {
        return;
      }
    });
  } catch (error) {
    inicializado = false;
  }

  window.ResenasVinyly = {
    NOMBRE_USUARIO: NOMBRE_USUARIO,
    MAX_CARACTERES: MAX_CARACTERES,
    leerResenas: leerResenas,
    obtenerResena: obtenerResena,
    guardarResena: guardarResena,
    eliminarResena: eliminarResena,
    contarResenas: contarResenas,
    leerResenasDe: leerResenasDe,
    resumenDe: resumenDe,
    formatearFecha: formatearFecha,
    crearEstrellasLectura: crearEstrellasLectura,
    crearSelectorEstrellas: crearSelectorEstrellas
  };
})();
