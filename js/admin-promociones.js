const promoTableBody = document.getElementById('promo-table-body');
const promoForm = document.getElementById('promo-form');
const promoFormPanel = document.getElementById('promo-form-panel');
const promoFormTitle = document.getElementById('promo-form-title');
const promoFeedback = document.getElementById('promo-feedback');
const promoModal = document.getElementById('promo-confirm-modal');
const promoModalTitle = document.getElementById('promo-modal-title');
const promoModalText = document.getElementById('promo-modal-text');
const promoModalConfirm = document.getElementById('promo-modal-confirm');
const promoTitleInput = document.getElementById('promo-title');
const promoCodeInput = document.getElementById('promo-code');
const promoTypeInput = document.getElementById('promo-type');
const promoValueInput = document.getElementById('promo-value');
const promoValueField = document.getElementById('promo-value-field');
const promoDescriptionInput = document.getElementById('promo-description');
const promoValidUntilInput = document.getElementById('promo-valid-until');
const promoStatusInput = document.getElementById('promo-status');
const promoIconField = document.getElementById('promo-icon-field');
const promoIconOptions = document.getElementById('promo-icon-options');

let promoEditingId = null;
let promoFormTrigger = null;
let promoModalAction = null;
let promoModalTrigger = null;
let promoModalKeyHandler = null;
let promoFeedbackTimer = null;

const promoErrorNodes = {
  title: document.getElementById('promo-title-error'),
  code: document.getElementById('promo-code-error'),
  type: document.getElementById('promo-type-error'),
  value: document.getElementById('promo-value-error'),
  description: document.getElementById('promo-description-error'),
  icon: document.getElementById('promo-icon-error'),
  validUntil: document.getElementById('promo-valid-until-error'),
  status: document.getElementById('promo-status-error')
};

const promoErrorControls = {
  title: [promoTitleInput],
  code: [promoCodeInput],
  type: [promoTypeInput],
  value: [promoValueInput],
  description: [promoDescriptionInput],
  icon: [],
  validUntil: [promoValidUntilInput],
  status: [promoStatusInput]
};

function mostrarAvisoPromociones(texto) {
  promoFeedback.textContent = texto;
  promoFeedback.classList.add('visible');
  clearTimeout(promoFeedbackTimer);
  promoFeedbackTimer = setTimeout(function () {
    promoFeedback.classList.remove('visible');
  }, 3000);
}

function obtenerRadiosIcono() {
  return Array.from(promoForm.querySelectorAll('input[name="icono"]'));
}

function obtenerIconoSeleccionado() {
  const seleccionado = obtenerRadiosIcono().find(function (radio) { return radio.checked; });
  return seleccionado ? seleccionado.value : '';
}

function crearOpcionesDeSelect(select, opciones, seleccionado) {
  select.replaceChildren();
  Object.entries(opciones).forEach(function (entrada) {
    const opcion = document.createElement('option');
    opcion.value = entrada[0];
    opcion.textContent = entrada[1];
    opcion.selected = entrada[0] === seleccionado;
    select.appendChild(opcion);
  });
}

function renderizarOpcionesFormulario() {
  crearOpcionesDeSelect(promoTypeInput, TIPOS_PROMOCION, 'porcentaje');
  crearOpcionesDeSelect(promoStatusInput, ESTADOS_PROMOCION, 'activa');
  promoIconOptions.replaceChildren();

  ICONOS_PROMOCION.forEach(function (icono, indice) {
    const etiqueta = document.createElement('label');
    etiqueta.className = 'admin-promo-icon-option';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'icono';
    radio.value = icono;
    radio.setAttribute('aria-label', 'Ícono ' + icono);
    radio.setAttribute('aria-describedby', 'promo-icon-error');
    radio.setAttribute('aria-invalid', 'false');
    if (indice === 0) {
      radio.checked = true;
    }
    const muestra = document.createElement('span');
    muestra.textContent = icono;
    etiqueta.append(radio, muestra);
    promoIconOptions.appendChild(etiqueta);
  });
  promoErrorControls.icon = obtenerRadiosIcono();
}

function ponerError(campo, texto) {
  const nodo = promoErrorNodes[campo];
  nodo.textContent = texto;
  nodo.hidden = !texto;
  promoErrorControls[campo].forEach(function (control) {
    control.setAttribute('aria-invalid', texto ? 'true' : 'false');
  });
  if (campo === 'icon') {
    promoIconField.setAttribute('aria-invalid', texto ? 'true' : 'false');
  }
}

function limpiarError(campo) {
  ponerError(campo, '');
}

function limpiarErrores() {
  Object.keys(promoErrorNodes).forEach(function (campo) {
    limpiarError(campo);
  });
}

function normalizarCodigoIngresado(valor) {
  return valor.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 20);
}

function manejarEntradaCodigo() {
  const valorAnterior = promoCodeInput.value;
  const inicio = promoCodeInput.selectionStart === null ? valorAnterior.length : promoCodeInput.selectionStart;
  const fin = promoCodeInput.selectionEnd === null ? inicio : promoCodeInput.selectionEnd;
  const prefijo = normalizarCodigoIngresado(valorAnterior.slice(0, inicio));
  const seleccion = normalizarCodigoIngresado(valorAnterior.slice(inicio, fin));
  const normalizado = normalizarCodigoIngresado(valorAnterior);

  if (normalizado !== valorAnterior) {
    promoCodeInput.value = normalizado;
    const nuevoInicio = Math.min(prefijo.length, normalizado.length);
    const nuevoFin = Math.min(nuevoInicio + seleccion.length, normalizado.length);
    promoCodeInput.setSelectionRange(nuevoInicio, nuevoFin);
  }

  limpiarError('code');
  actualizarVistaPrevia();
}

function actualizarCampoValor() {
  const tipo = promoTypeInput.value;
  const esDosPorUno = tipo === 'dosPorUno';
  promoValueField.hidden = esDosPorUno;
  promoValueInput.disabled = esDosPorUno;
  promoValueInput.required = !esDosPorUno;

  if (tipo === 'porcentaje') {
    promoValueInput.inputMode = 'numeric';
    promoValueInput.placeholder = '10';
    promoValueInput.setAttribute('aria-label', 'Porcentaje de descuento');
  } else {
    promoValueInput.inputMode = 'decimal';
    promoValueInput.placeholder = '100.00';
    promoValueInput.setAttribute('aria-label', 'Monto fijo del descuento');
  }

  limpiarError('value');
  actualizarVistaPrevia();
}

function actualizarContadorDescripcion() {
  document.getElementById('promo-description-count').textContent = promoDescriptionInput.value.length + '/120';
}

function obtenerValorVistaPrevia() {
  const tipo = promoTypeInput.value;
  if (tipo === 'dosPorUno') {
    return '2x1';
  }

  const texto = promoValueInput.value.trim();
  if (tipo === 'porcentaje') {
    return /^\d+$/.test(texto) ? texto + '%' : '—';
  }

  const valor = Number(texto);
  return texto && Number.isFinite(valor) && valor > 0
    ? etiquetaPromocion({ tipo: 'montoFijo', valor: Math.round(valor * 100) / 100 })
    : '$—';
}

function actualizarVistaPrevia() {
  const icono = obtenerIconoSeleccionado() || ICONOS_PROMOCION[0];
  const codigo = promoCodeInput.value || 'CODIGO';
  const vigencia = promoValidUntilInput.value
    ? formatearVigencia({ vigencia: promoValidUntilInput.value })
    : '';

  document.getElementById('promo-preview-icon').textContent = icono;
  document.getElementById('promo-preview-value').textContent = obtenerValorVistaPrevia();
  document.getElementById('promo-preview-title').textContent = promoTitleInput.value.trim() || 'Título de promoción';
  document.getElementById('promo-preview-description').textContent = promoDescriptionInput.value.trim()
    || 'Tu descripción aparecerá aquí.';
  document.getElementById('promo-preview-code').firstElementChild.textContent = codigo;
  const vigenciaPreview = document.getElementById('promo-preview-validity');
  vigenciaPreview.textContent = vigencia;
  vigenciaPreview.hidden = !vigencia;
}

function renderizarResumen(promociones) {
  const activas = promociones.filter(function (promocion) { return promocion.estado === 'activa'; }).length;
  document.getElementById('promo-summary').textContent = activas + ' activas · ' + promociones.length + ' en total';
}

function crearCelda(texto, clase) {
  const celda = document.createElement('td');
  if (clase) {
    celda.className = clase;
  }
  celda.textContent = texto;
  return celda;
}

function crearBotonAccion(texto, accion, promocion, clase) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = clase || 'admin-row-action';
  boton.dataset.promoAction = accion;
  boton.dataset.id = promocion.id;
  boton.textContent = texto;
  boton.setAttribute('aria-label', texto + ' ' + promocion.titulo);
  return boton;
}

function crearChipEstado(estado) {
  const chip = document.createElement('span');
  const clases = {
    activa: 'status-delivered',
    pausada: 'status-paused',
    programada: 'status-pending',
    finalizada: 'status-cancelled'
  };
  chip.className = 'admin-status ' + (clases[estado] || 'status-paused');
  chip.textContent = ESTADOS_PROMOCION[estado] || ESTADOS_PROMOCION.pausada;
  return chip;
}

function renderizarEstadoVacio() {
  const fila = document.createElement('tr');
  const celda = document.createElement('td');
  celda.className = 'admin-promo-empty-cell';
  celda.colSpan = 6;
  const envoltorio = document.createElement('div');
  envoltorio.className = 'admin-promo-empty';
  const texto = document.createElement('p');
  texto.textContent = 'Aún no hay promociones';
  const agregar = document.createElement('button');
  agregar.className = 'btn-gradiente admin-primary-button';
  agregar.type = 'button';
  agregar.dataset.promoAction = 'add';
  agregar.textContent = 'Agregar promoción';
  envoltorio.append(texto, agregar);
  celda.appendChild(envoltorio);
  fila.appendChild(celda);
  promoTableBody.appendChild(fila);
}

function renderizarPromociones(promociones) {
  promoTableBody.replaceChildren();
  renderizarResumen(promociones);

  if (promociones.length === 0) {
    renderizarEstadoVacio();
    return;
  }

  promociones.forEach(function (promocion) {
    const fila = document.createElement('tr');
    fila.dataset.id = promocion.id;
    const celdaNombre = document.createElement('td');
    const nombre = document.createElement('span');
    nombre.className = 'admin-promo-name';
    const icono = document.createElement('span');
    icono.className = 'admin-promo-table-icon';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = promocion.icono;
    const titulo = document.createElement('strong');
    titulo.textContent = promocion.titulo;
    nombre.append(icono, titulo);
    celdaNombre.appendChild(nombre);

    const codigo = document.createElement('code');
    codigo.className = 'admin-promo-code';
    codigo.textContent = promocion.codigo;
    const vigencia = formatearVigencia(promocion) || 'Sin vigencia';
    const celdaEstado = document.createElement('td');
    celdaEstado.appendChild(crearChipEstado(promocion.estado));
    const celdaAcciones = document.createElement('td');
    celdaAcciones.className = 'admin-table-actions';
    celdaAcciones.append(
      crearBotonAccion('Editar', 'edit', promocion),
      crearBotonAccion(promocion.estado === 'activa' ? 'Pausar' : 'Activar', 'toggle', promocion),
      crearBotonAccion('Eliminar', 'delete', promocion, 'admin-row-action admin-row-delete')
    );

    fila.append(
      celdaNombre,
      crearCelda(codigo.textContent),
      crearCelda(etiquetaPromocion(promocion)),
      crearCelda(vigencia),
      celdaEstado,
      celdaAcciones
    );
    fila.children[1].replaceChildren(codigo);
    promoTableBody.appendChild(fila);
  });
}

function refrescarPromociones() {
  renderizarPromociones(leerPromociones());
}

function enfocarAccionPromocion(id, accion) {
  const boton = Array.from(promoTableBody.querySelectorAll('button[data-promo-action]'))
    .find(function (elemento) {
      return elemento.dataset.id === id && elemento.dataset.promoAction === accion;
    });
  (boton || document.getElementById('add-promo-button')).focus();
}

function abrirFormulario(promocion, disparador) {
  promoEditingId = promocion ? promocion.id : null;
  promoFormTrigger = disparador || document.getElementById('add-promo-button');
  limpiarErrores();
  promoForm.reset();
  promoTitleInput.value = promocion ? promocion.titulo : '';
  promoCodeInput.value = promocion ? promocion.codigo : '';
  promoTypeInput.value = promocion ? promocion.tipo : 'porcentaje';
  promoValueInput.value = promocion && promocion.tipo !== 'dosPorUno' ? String(promocion.valor) : '';
  promoDescriptionInput.value = promocion ? promocion.descripcion : '';
  promoValidUntilInput.value = promocion ? promocion.vigencia : '';
  promoStatusInput.value = promocion ? promocion.estado : 'activa';
  obtenerRadiosIcono().forEach(function (radio) {
    radio.checked = radio.value === (promocion ? promocion.icono : ICONOS_PROMOCION[0]);
  });
  promoFormTitle.textContent = promocion ? 'Editar promoción' : 'Agregar promoción';
  promoFormPanel.hidden = false;
  actualizarCampoValor();
  actualizarContadorDescripcion();
  actualizarVistaPrevia();
  promoTitleInput.focus();
}

function cerrarFormulario(restaurarFoco) {
  promoFormPanel.hidden = true;
  promoForm.reset();
  promoEditingId = null;
  limpiarErrores();
  actualizarCampoValor();
  actualizarContadorDescripcion();
  actualizarVistaPrevia();

  if (restaurarFoco !== false && promoFormTrigger && promoFormTrigger.isConnected) {
    promoFormTrigger.focus();
  }
  promoFormTrigger = null;
}

function validarFormulario() {
  limpiarErrores();
  const titulo = promoTitleInput.value.trim();
  const codigo = normalizarCodigoIngresado(promoCodeInput.value);
  const tipo = promoTypeInput.value;
  const textoValor = promoValueInput.value.trim();
  const descripcion = promoDescriptionInput.value.trim();
  const icono = obtenerIconoSeleccionado();
  const vigencia = promoValidUntilInput.value;
  const estado = promoStatusInput.value;
  const errores = {};

  if (!titulo) {
    errores.title = 'Escribe un título.';
  } else if (titulo.length > 40) {
    errores.title = 'El título admite hasta 40 caracteres.';
  }
  if (codigo.length < 3 || codigo.length > 20 || !/^[A-Z0-9]+$/.test(codigo)) {
    errores.code = 'Usa de 3 a 20 letras o números.';
  }
  if (!Object.prototype.hasOwnProperty.call(TIPOS_PROMOCION, tipo)) {
    errores.type = 'Selecciona un tipo válido.';
  }
  if (tipo === 'porcentaje') {
    const valor = Number(textoValor);
    if (!/^\d+$/.test(textoValor) || !Number.isInteger(valor) || valor < 1 || valor > 100) {
      errores.value = 'Usa un número entero entre 1 y 100';
    }
  } else if (tipo === 'montoFijo') {
    const valor = Number(textoValor);
    if (!/^\d+(?:\.\d{1,2})?$/.test(textoValor)
        || !Number.isFinite(valor) || valor < 0.01 || valor > 99999.99) {
      errores.value = 'Escribe un monto válido, por ejemplo 100 o 49.90';
    }
  }
  if (descripcion.length > 120) {
    errores.description = 'La descripción admite hasta 120 caracteres.';
  }
  if (!ICONOS_PROMOCION.includes(icono)) {
    errores.icon = 'Elige un ícono.';
  }
  if (vigencia && !/^\d{4}-\d{2}-\d{2}$/.test(vigencia)) {
    errores.validUntil = 'Selecciona una fecha válida.';
  }
  if (!Object.prototype.hasOwnProperty.call(ESTADOS_PROMOCION, estado)) {
    errores.status = 'Selecciona un estado válido.';
  }

  const ordenErrores = ['title', 'code', 'type', 'value', 'description', 'icon', 'validUntil', 'status'];
  ordenErrores.forEach(function (campo) {
    if (errores[campo]) {
      ponerError(campo, errores[campo]);
    }
  });
  const primerError = ordenErrores.find(function (campo) { return Boolean(errores[campo]); });
  if (primerError) {
    const control = promoErrorControls[primerError][0];
    (control || obtenerRadiosIcono()[0]).focus();
    return null;
  }

  return {
    codigo: codigo,
    titulo: titulo,
    descripcion: descripcion,
    tipo: tipo,
    valor: tipo === 'dosPorUno' ? 0 : Number(textoValor),
    icono: icono,
    estado: estado,
    vigencia: vigencia
  };
}

function crearIdPromocion(promociones) {
  let id;
  do {
    const sufijo = Math.random().toString(36).slice(2, 8) || '0';
    id = 'promo-' + Date.now() + '-' + sufijo;
  } while (promociones.some(function (promocion) { return promocion.id === id; }));
  return id;
}

function manejarPromocionInexistente(esEdicion) {
  refrescarPromociones();
  mostrarAvisoPromociones('Esa promoción ya no existe');
  if (esEdicion) {
    promoEditingId = null;
    promoFormTitle.textContent = 'Agregar promoción';
  }
}

function guardarPromocion(evento) {
  evento.preventDefault();
  const datos = validarFormulario();
  if (!datos) {
    return;
  }

  const promociones = leerPromociones();
  const existente = promoEditingId
    ? promociones.find(function (promocion) { return promocion.id === promoEditingId; })
    : null;
  if (promoEditingId && !existente) {
    manejarPromocionInexistente(true);
    return;
  }
  if (promociones.some(function (promocion) {
    return promocion.codigo.toUpperCase() === datos.codigo && promocion.id !== promoEditingId;
  })) {
    ponerError('code', 'Ese código ya está en uso.');
    promoCodeInput.focus();
    return;
  }

  const codigoAnterior = existente ? existente.codigo : '';
  const promocion = Object.assign({}, existente || {}, datos, {
    id: existente ? existente.id : crearIdPromocion(promociones)
  });
  if (existente) {
    promociones[promociones.indexOf(existente)] = promocion;
  } else {
    promociones.push(promocion);
  }

  if (!guardarPromociones(promociones)) {
    mostrarAvisoPromociones('No se pudo guardar en este navegador');
    return;
  }

  const eraEdicion = Boolean(existente);
  const codigoCambio = eraEdicion && codigoAnterior !== promocion.codigo;
  refrescarPromociones();
  cerrarFormulario(false);
  mostrarAvisoPromociones(eraEdicion
    ? 'Promoción actualizada correctamente' + (codigoCambio ? '. El código anterior dejó de funcionar' : '')
    : 'Promoción creada correctamente');
  enfocarAccionPromocion(promocion.id, 'edit');
}

function alternarEstadoPromocion(id) {
  const promociones = leerPromociones();
  const indice = promociones.findIndex(function (promocion) { return promocion.id === id; });
  if (indice === -1) {
    manejarPromocionInexistente(false);
    return;
  }

  const activa = promociones[indice].estado === 'activa';
  promociones[indice] = Object.assign({}, promociones[indice], {
    estado: activa ? 'pausada' : 'activa'
  });
  if (!guardarPromociones(promociones)) {
    mostrarAvisoPromociones('No se pudo guardar en este navegador');
    return;
  }

  refrescarPromociones();
  mostrarAvisoPromociones(activa ? 'Promoción pausada' : 'Promoción activada');
  enfocarAccionPromocion(id, 'toggle');
}

function abrirModal(tipo, id, titulo, disparador) {
  promoModalAction = { tipo: tipo, id: id };
  promoModalTrigger = disparador;
  promoModalTitle.textContent = tipo === 'delete' ? 'Eliminar promoción' : 'Restablecer ejemplos';
  promoModalText.textContent = tipo === 'delete'
    ? '¿Eliminar la promoción ' + titulo + '? Dejará de aparecer en la tienda y su código ya no funcionará.'
    : '¿Restablecer los ejemplos? Se reemplazará la lista guardada por las promociones iniciales.';
  promoModalConfirm.textContent = tipo === 'delete' ? 'Eliminar' : 'Restablecer';
  promoModal.hidden = false;
  document.body.classList.add('modal-abierto');
  promoModalConfirm.focus();
  promoModalKeyHandler = manejarTecladoModal;
  document.addEventListener('keydown', promoModalKeyHandler);
}

function obtenerControlesEnModal() {
  return Array.from(promoModal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(function (control) {
    return control.getAttribute('aria-hidden') !== 'true' && control.offsetParent !== null;
  });
}

function manejarTecladoModal(evento) {
  if (evento.key === 'Escape') {
    evento.preventDefault();
    cerrarModal();
    return;
  }
  if (evento.key !== 'Tab') {
    return;
  }

  const controles = obtenerControlesEnModal();
  if (controles.length === 0) {
    evento.preventDefault();
    return;
  }
  const primero = controles[0];
  const ultimo = controles[controles.length - 1];
  if (evento.shiftKey && (document.activeElement === primero || !promoModal.contains(document.activeElement))) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && (document.activeElement === ultimo || !promoModal.contains(document.activeElement))) {
    evento.preventDefault();
    primero.focus();
  }
}

function cerrarModal(restaurarFoco) {
  promoModal.hidden = true;
  document.body.classList.remove('modal-abierto');
  if (promoModalKeyHandler) {
    document.removeEventListener('keydown', promoModalKeyHandler);
    promoModalKeyHandler = null;
  }
  promoModalAction = null;
  if (restaurarFoco !== false) {
    const respaldo = document.getElementById('add-promo-button');
    (promoModalTrigger && promoModalTrigger.isConnected ? promoModalTrigger : respaldo).focus();
  }
  promoModalTrigger = null;
}

function eliminarPromocion(id) {
  const promociones = leerPromociones();
  const indice = promociones.findIndex(function (promocion) { return promocion.id === id; });
  if (indice === -1) {
    cerrarModal(false);
    manejarPromocionInexistente(false);
    document.getElementById('add-promo-button').focus();
    return;
  }

  const siguiente = promociones[indice + 1] || promociones[indice - 1];
  promociones.splice(indice, 1);
  if (!guardarPromociones(promociones)) {
    cerrarModal();
    mostrarAvisoPromociones('No se pudo guardar en este navegador');
    return;
  }

  cerrarModal(false);
  refrescarPromociones();
  mostrarAvisoPromociones('Promoción eliminada correctamente');
  if (siguiente) {
    const botonSiguiente = Array.from(promoTableBody.querySelectorAll('button[data-promo-action]'))
      .find(function (boton) { return boton.dataset.id === siguiente.id; });
    (botonSiguiente || document.getElementById('add-promo-button')).focus();
  } else {
    document.getElementById('add-promo-button').focus();
  }
}

function confirmarAccionModal() {
  if (!promoModalAction) {
    return;
  }

  if (promoModalAction.tipo === 'delete') {
    eliminarPromocion(promoModalAction.id);
    return;
  }

  if (!restablecerPromociones()) {
    cerrarModal();
    mostrarAvisoPromociones('No se pudo guardar en este navegador');
    return;
  }
  cerrarModal();
  refrescarPromociones();
  mostrarAvisoPromociones('Promociones restablecidas');
}

function manejarAccionesTabla(evento) {
  const boton = evento.target.closest('button[data-promo-action]');
  if (!boton || !promoTableBody.contains(boton)) {
    return;
  }

  const accion = boton.dataset.promoAction;
  const id = boton.dataset.id;
  if (accion === 'add') {
    abrirFormulario(null, boton);
  } else if (accion === 'edit') {
    const promocion = leerPromociones().find(function (elemento) { return elemento.id === id; });
    if (!promocion) {
      manejarPromocionInexistente(false);
      return;
    }
    abrirFormulario(promocion, boton);
  } else if (accion === 'toggle') {
    alternarEstadoPromocion(id);
  } else if (accion === 'delete') {
    const promocion = leerPromociones().find(function (elemento) { return elemento.id === id; });
    if (!promocion) {
      manejarPromocionInexistente(false);
      return;
    }
    abrirModal('delete', id, promocion.titulo, boton);
  }
}

function alCambiarPromociones(evento) {
  if (evento.key === null || evento.key === CLAVE_PROMOCIONES) {
    refrescarPromociones();
  }
}

renderizarOpcionesFormulario();
promoForm.addEventListener('submit', guardarPromocion);
promoForm.addEventListener('input', function (evento) {
  if (evento.target === promoCodeInput) {
    return;
  }
  const campo = {
    [promoTitleInput.id]: 'title',
    [promoValueInput.id]: 'value',
    [promoDescriptionInput.id]: 'description',
    [promoValidUntilInput.id]: 'validUntil'
  }[evento.target.id];
  if (campo) {
    limpiarError(campo);
  }
  if (evento.target === promoDescriptionInput) {
    actualizarContadorDescripcion();
  }
  actualizarVistaPrevia();
});
promoCodeInput.addEventListener('input', manejarEntradaCodigo);
promoTypeInput.addEventListener('change', function () {
  limpiarError('type');
  actualizarCampoValor();
});
promoStatusInput.addEventListener('change', function () { limpiarError('status'); });
promoIconOptions.addEventListener('change', function () {
  limpiarError('icon');
  actualizarVistaPrevia();
});
promoValidUntilInput.addEventListener('change', actualizarVistaPrevia);
document.getElementById('add-promo-button').addEventListener('click', function (evento) {
  abrirFormulario(null, evento.currentTarget);
});
document.getElementById('cancel-promo-button').addEventListener('click', function () {
  cerrarFormulario(true);
});
document.getElementById('reset-promos-button').addEventListener('click', function (evento) {
  abrirModal('reset', null, '', evento.currentTarget);
});
promoTableBody.addEventListener('click', manejarAccionesTabla);
document.getElementById('promo-modal-close').addEventListener('click', function () { cerrarModal(); });
document.getElementById('promo-modal-cancel').addEventListener('click', function () { cerrarModal(); });
promoModalConfirm.addEventListener('click', confirmarAccionModal);
promoModal.addEventListener('click', function (evento) {
  if (evento.target === promoModal) {
    cerrarModal();
  }
});
window.addEventListener('pageshow', refrescarPromociones);
window.addEventListener('storage', alCambiarPromociones);

actualizarCampoValor();
actualizarContadorDescripcion();
actualizarVistaPrevia();
refrescarPromociones();