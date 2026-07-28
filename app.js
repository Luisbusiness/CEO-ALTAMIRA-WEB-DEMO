/* ============================================
   CEO ALTAMIRA — app.js
   ============================================ */

// ---- Número de WhatsApp del consultorio ----
// REEMPLAZAR con el número real (código de país sin +)
const WA_NUMBER = '58XXXXXXXXXX';

/* ============================================
   1. HEADER — scroll + hamburger
   ============================================ */
const header     = document.getElementById('header');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Cerrar mobile menu al hacer clic en un enlace
document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ============================================
   2. ANIMACIONES DE SCROLL (IntersectionObserver)
   ============================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================
   3. SIMULADOR DE ESPECIALIDAD
   ============================================ */
const datos = {
  ortodoncia: {
    especialidad: 'Ortodoncia',
    descripcion:  'La alineación dental requiere una evaluación con nuestro ortodoncista para determinar el tipo de tratamiento más adecuado para tu caso — brackets convencionales o alineadores.',
    tiempo:       '⏱ Evaluación inicial: 30 min',
    motivo:       'Ortodoncia / Alineación dental',
  },
  endodoncia: {
    especialidad: 'Endodoncia (Tratamiento de Conducto)',
    descripcion:  'El dolor o sensibilidad al frío y calor puede indicar daño en la pulpa del diente. Nuestro endodoncista puede evaluarlo y, en muchos casos, salvar el diente natural.',
    tiempo:       '⏱ Consulta urgente disponible',
    motivo:       'Endodoncia / Dolor de muela',
  },
  estetica: {
    especialidad: 'Diseño de Sonrisa',
    descripcion:  'Un cambio estético integral empieza con una planificación digital de tu sonrisa. Podemos explorar blanqueamiento, carillas o restauraciones según lo que buscas lograr.',
    tiempo:       '⏱ Consulta de planificación: 45 min',
    motivo:       'Diseño de Sonrisa / Estética dental',
  },
  nino: {
    especialidad: 'Odontopediatría',
    descripcion:  'Los niños necesitan atención especializada en un ambiente seguro y amigable. Nuestro odontopediatra hace que la primera experiencia dental sea positiva.',
    tiempo:       '⏱ Primera consulta pediátrica: 30 min',
    motivo:       'Odontopediatría (niño/niña)',
  },
  cirugia: {
    especialidad: 'Cirugía Bucal',
    descripcion:  'La extracción de cordales o piezas comprometidas requiere evaluación y a veces una radiografía panorámica. Nuestro cirujano bucal te guiará en todo el proceso.',
    tiempo:       '⏱ Evaluación quirúrgica: 20 min',
    motivo:       'Cirugía Bucal / Extracción dental',
  },
  implante: {
    especialidad: 'Implantología Dental',
    descripcion:  'Los implantes de titanio son la solución más duradera para reemplazar piezas perdidas. La evaluación determina si eres candidato y cuál es el plan de tratamiento ideal.',
    tiempo:       '⏱ Consulta de implantología: 40 min',
    motivo:       'Implantes Dentales',
  },
};

let seleccionActual = null;

const simOpciones   = document.querySelectorAll('.sim-opcion');
const simResultado  = document.getElementById('simResultado');
const simEspecialidad = document.getElementById('simEspecialidad');
const simDescripcion  = document.getElementById('simDescripcion');
const simTiempo       = document.getElementById('simTiempo');
const simBtnCita      = document.getElementById('simBtnCita');
const simBtnReset     = document.getElementById('simBtnReset');

simOpciones.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    const d   = datos[key];
    if (!d) return;

    seleccionActual = key;

    // Marcar opción activa
    simOpciones.forEach(b => {
      b.classList.remove('activa');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('activa');
    btn.setAttribute('aria-pressed', 'true');

    // Actualizar resultado
    simEspecialidad.textContent = d.especialidad;
    simDescripcion.textContent  = d.descripcion;
    simTiempo.textContent       = d.tiempo;

    // El botón de cita lleva el motivo preseleccionado en el formulario
    simBtnCita.addEventListener('click', () => {
      const select = document.getElementById('especialidad');
      if (select) {
        const opcion = Array.from(select.options).find(o =>
          o.value.toLowerCase().includes(d.motivo.toLowerCase().split('/')[0].trim().toLowerCase())
        );
        if (opcion) select.value = opcion.value;
      }
    }, { once: true });

    simResultado.classList.add('visible');
    simResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

simBtnReset.addEventListener('click', () => {
  simOpciones.forEach(b => {
    b.classList.remove('activa');
    b.setAttribute('aria-pressed', 'false');
  });
  simResultado.classList.remove('visible');
  seleccionActual = null;
});

/* ============================================
   4. FORMULARIO → MENSAJE WHATSAPP
   ============================================ */
const formCita = document.getElementById('formCita');

formCita.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre      = document.getElementById('nombre').value.trim();
  const telefono    = document.getElementById('telefono').value.trim();
  const especialidad = document.getElementById('especialidad').value;
  const horario     = document.getElementById('horario').value;
  const mensaje     = document.getElementById('mensaje').value.trim();

  // Validación mínima
  if (!nombre || !telefono || !especialidad) {
    alert('Por favor completa tu nombre, teléfono y especialidad para continuar.');
    return;
  }

  // Construir mensaje estructurado
  let texto = `Hola, soy *${nombre}* y quisiera agendar una cita en CEO Altamira.`;
  texto += `\n\n*¿Qué necesito?* ${especialidad}`;
  if (horario) texto += `\n*Horario preferido:* ${horario}`;
  texto += `\n*Mi teléfono:* ${telefono}`;
  if (mensaje) texto += `\n\n*Comentario:* ${mensaje}`;
  texto += '\n\nQuedo a la espera. Gracias.';

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

/* ============================================
   5. BOTÓN FLOTANTE WA — actualizar dinámicamente
   ============================================ */
const waFloat = document.querySelector('.wa-float');
if (waFloat && WA_NUMBER !== '58XXXXXXXXXX') {
  const msgDefault = encodeURIComponent('Hola, me gustaría agendar una cita en CEO Altamira.');
  waFloat.href = `https://wa.me/${WA_NUMBER}?text=${msgDefault}`;
}
