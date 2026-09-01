declare const L: any;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderContact(container: HTMLElement) {
  const studioName = 'Estudio Bruma Digital';
  const officeAddress = 'Calle 48 N° 650, La Plata, Buenos Aires';
  const email = 'hola@brumadigital.dev';
  const phone = '+54 221 456-7890';
  const hours = 'Lunes a viernes · 9:00 a 18:00';
  const officeCoords = { lat: -34.9215, lng: -57.9536 };


  container.innerHTML = `
    <section class="view contact-page">
      <div class="section-header contact-header">
        <h1>📍 Contacto</h1>
      </div>

      <div class="contact-layout">
        <article class="contact-card">
          <h2>${escapeHtml(studioName)}</h2>

          <ul class="contact-list" style="margin-top: 1rem;">

            <li>
              <span class="contact-list__label">Dirección</span>
              <strong>${escapeHtml(officeAddress)}</strong>
            </li>
            <li>
              <span class="contact-list__label">Email</span>
              <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
            </li>
            <li>
              <span class="contact-list__label">Teléfono</span>
              <a href="tel:${escapeHtml(phone.replace(/\s+/g, ''))}">${escapeHtml(phone)}</a>
            </li>
            <li>
              <span class="contact-list__label">Horario</span>
              <strong>${escapeHtml(hours)}</strong>
            </li>
          </ul>
        </article>

        <aside class="contact-map-card">
          <div class="contact-map-card__header">
            <h3>Nuestra ubicación</h3>
          </div>

          <div class="contact-map-wrapper">
            <div id="contact-map" style="height: 270px; width: 100%; border-radius: 6px; z-index: 1;"></div>
          </div>
        </aside>
      </div>


      <form class="contact-form" id="contact-form" novalidate>
        <div class="contact-form__header">
          <h3>Escribinos</h3>
          <p>Dejanos tu mensaje y te respondemos a la brevedad.</p>
        </div>

        <div class="contact-form__grid">
          <label class="field">
            <span>Nombre</span>
            <input type="text" name="name" placeholder="Tu nombre" required />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" name="email" placeholder="tu@email.com" required />
          </label>
        </div>

        <label class="field">
          <span>Asunto</span>
          <input type="text" name="subject" placeholder="¿Sobre qué querés hablar?" required />
        </label>

        <label class="field">
          <span>Mensaje</span>
          <textarea name="message" rows="5" placeholder="Contanos tu idea, proyecto o consulta..." required></textarea>
        </label>

        <div class="contact-form__actions">
          <button type="submit" class="btn btn-primary">Enviar mensaje</button>
        </div>

        <p class="contact-form__message" id="contact-form-message"></p>
      </form>
    </section>
  `;

  // Inicializamos el mapa interactivo con Leaflet + OpenStreetMap
  setTimeout(() => {
    const mapElement = document.getElementById('contact-map');
    if (!mapElement || typeof L === 'undefined') return;

    try {
      const coords: [number, number] = [officeCoords.lat, officeCoords.lng];
      const map = L.map('contact-map', {
        scrollWheelZoom: false, // evita que haga zoom al scrollear la pagina
      }).setView(coords, 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(coords, {
        title: studioName,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 0.85rem; color: #0f172a; line-height: 1.3;">
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 2px;">${escapeHtml(studioName)}</strong>
          <span>${escapeHtml(officeAddress)}</span>
          <span style="display: block; color: #64748b; font-size: 0.75rem; margin-top: 4px;">${escapeHtml(hours)}</span>
        </div>
      `).openPopup();

      // reajustamos el tamaño del mapa una vez montado en el DOM
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    } catch (err) {
      console.error('Error al inicializar el mapa de Leaflet:', err);
    }
  }, 50);

  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const message = document.getElementById('contact-form-message');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const messageText = String(formData.get('message') || '').trim();

    if (!name || !email || !subject || !messageText) {
      if (message) {
        message.textContent = 'Completá todos los campos para enviar tu consulta.';
        message.classList.remove('contact-form__message--success');
        message.classList.add('contact-form__message--error');
      }
      return;
    }

    if (message) {
      message.textContent = `Gracias ${name}, tu mensaje fue enviado correctamente.`;
      message.classList.remove('contact-form__message--error');
      message.classList.add('contact-form__message--success');
    }

    form.reset();
  });
}

