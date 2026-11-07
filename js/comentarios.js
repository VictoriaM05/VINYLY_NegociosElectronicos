(function () {
  // Coincide con el nombre que se muestra en el perfil.
  const NOMBRE_USUARIO = 'Pedrito Vinilo';
  const MAX_CARACTERES = 280;
  const CLAVE_COMENTARIOS = 'comunidadVinyly';
  let comentarios = [];
  let idsComentarios = new Set();
  let inicializado = false;

  function crearIdComentario() {
    try {
      let id;
      do {
        id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      } while (idsComentarios.has(id));
      return id;
    } catch (error) {
      return '';
    }
  }

  function obtenerEditadoEn(valor) {
    try {
      if (typeof valor !== 'string' || !valor) {
        return '';
      }
      const fecha = new Date(valor);
      return Number.isNaN(fecha.getTime()) ? '' : fecha.toISOString();
    } catch (error) {
      return '';
    }
  }

  function inicializar() {
    try {
      if (inicializado) {
        return;
      }
      inicializado = true;
      const comentariosAlmacenados = JSON.parse(window.localStorage.getItem(CLAVE_COMENTARIOS) || '[]');
      if (!Array.isArray(comentariosAlmacenados)) {
        return;
      }

      let requiereMigracion = false;
      comentariosAlmacenados.forEach(function (comentario) {
        if (
          comentario &&
          typeof comentario.nombre === 'string' &&
          typeof comentario.fecha === 'string' &&
          typeof comentario.texto === 'string'
        ) {
          const editadoEn = obtenerEditadoEn(comentario.editadoEn);
          const comentarioNormalizado = {
            nombre: comentario.nombre,
            fecha: comentario.fecha,
            texto: comentario.texto,
            id: typeof comentario.id === 'string' && comentario.id
              ? comentario.id
              : crearIdComentario(),
            editadoEn: editadoEn
          };

          if (idsComentarios.has(comentarioNormalizado.id)) {
            comentarioNormalizado.id = crearIdComentario();
            requiereMigracion = true;
          }
          if (comentarioNormalizado.id !== comentario.id || comentario.editadoEn !== editadoEn) {
            requiereMigracion = true;
          }

          idsComentarios.add(comentarioNormalizado.id);
          comentarios.push(comentarioNormalizado);
        }
      });

      if (requiereMigracion) {
        guardarCambios();
      }
    } catch (error) {
      comentarios = [];
      idsComentarios = new Set();
    }
  }

  function guardarCambios() {
    try {
      window.localStorage.setItem(CLAVE_COMENTARIOS, JSON.stringify(comentarios));
      return true;
    } catch (error) {
      return false;
    }
  }

  function notificarActualizacion() {
    try {
      window.dispatchEvent(new CustomEvent('comentarios:actualizados'));
    } catch (error) {
      return false;
    }
    return true;
  }

  function copiarComentario(comentario) {
    try {
      return Object.assign({}, comentario);
    } catch (error) {
      return null;
    }
  }

  function leerPropios() {
    try {
      inicializar();
      return comentarios.map(function (comentario) {
        return copiarComentario(comentario);
      }).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function contar() {
    try {
      inicializar();
      return comentarios.length;
    } catch (error) {
      return 0;
    }
  }

  function agregar(texto) {
    try {
      inicializar();
      const textoNormalizado = typeof texto === 'string'
        ? texto.trim().slice(0, MAX_CARACTERES)
        : '';
      if (!textoNormalizado) {
        return { ok: false, vacio: true };
      }

      const comentario = {
        id: crearIdComentario(),
        nombre: NOMBRE_USUARIO,
        fecha: new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        texto: textoNormalizado,
        editadoEn: ''
      };
      if (!comentario.id) {
        return { ok: false, error: true, persistido: false };
      }

      comentarios.push(comentario);
      idsComentarios.add(comentario.id);
      const persistido = guardarCambios();
      notificarActualizacion();
      return { ok: true, persistido: persistido, comentario: copiarComentario(comentario) };
    } catch (error) {
      return { ok: false, error: true, persistido: false };
    }
  }

  function actualizar(id, texto) {
    try {
      inicializar();
      const textoNormalizado = typeof texto === 'string'
        ? texto.trim().slice(0, MAX_CARACTERES)
        : '';
      if (!textoNormalizado) {
        return { ok: false, sinCambios: true };
      }

      const comentario = comentarios.find(function (elemento) {
        return elemento.id === id;
      });
      if (!comentario) {
        return { ok: false, noExiste: true };
      }
      if (textoNormalizado === comentario.texto) {
        return { ok: false, sinCambios: true };
      }

      comentario.texto = textoNormalizado;
      comentario.editadoEn = new Date().toISOString();
      const persistido = guardarCambios();
      notificarActualizacion();
      return { ok: true, persistido: persistido, comentario: copiarComentario(comentario) };
    } catch (error) {
      return { ok: false, error: true, persistido: false };
    }
  }

  function eliminar(id) {
    try {
      inicializar();
      const indice = comentarios.findIndex(function (comentario) {
        return comentario.id === id;
      });
      if (indice === -1) {
        return { ok: false, noExiste: true, persistido: false };
      }

      const comentarioEliminado = comentarios.splice(indice, 1)[0];
      idsComentarios.delete(comentarioEliminado.id);
      const persistido = guardarCambios();
      notificarActualizacion();
      return { ok: true, persistido: persistido };
    } catch (error) {
      return { ok: false, error: true, persistido: false };
    }
  }

  try {
    window.addEventListener('storage', function (evento) {
      try {
        if (evento.key !== CLAVE_COMENTARIOS) {
          return;
        }
        comentarios = [];
        idsComentarios = new Set();
        inicializado = false;
        inicializar();
        window.dispatchEvent(new CustomEvent('comentarios:actualizados', {
          detail: { origen: 'storage' }
        }));
      } catch (error) {
        return;
      }
    });
  } catch (error) {
    inicializado = false;
  }

  window.ComentariosVinyly = {
    NOMBRE_USUARIO: NOMBRE_USUARIO,
    MAX_CARACTERES: MAX_CARACTERES,
    leerPropios: leerPropios,
    contar: contar,
    agregar: agregar,
    actualizar: actualizar,
    eliminar: eliminar
  };
})();
