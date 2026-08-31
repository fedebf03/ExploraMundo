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
  const studioTag = 'Diseño, estrategia y experiencias digitales';
  const officeAddress = 'Calle 48 N° 650, La Plata, Buenos Aires';
  const email = 'hola@brumadigital.dev';
  const phone = '+54 221 456-7890';
  const hours = 'Lunes a viernes · 9:00 a 18:00';

  container.innerHTML = `
    <section class="view contact-page">
      <div class="section-header contact-header">
        <h1>📍 Contacto</h1>
        <p>Estamos en La Plata y listos para ayudarte a crecer.</p>
      </div>

      <div class="contact-layout">
        <article class="contact-card">
          <div class="contact-card__badge">Estudio</div>
          <h2>${escapeHtml(studioName)}</h2>
          <p class="contact-card__tagline">${escapeHtml(studioTag)}</p>

          <ul class="contact-list">
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

        <aside class="contact-map-card" aria-label="Mapa de la ubicación del estudio">
          <div class="contact-map-card__header">
            <h3>Ubicación</h3>
            <span>Catedral de La Plata</span>
          </div>

          <div class="contact-map" role="img" aria-label="Mapa de la zona de la Catedral de La Plata">
            <div class="map-grid"></div>
            <div class="map-road map-road--vertical">
              <span class="road-name">Calle 48</span>
            </div>
            <div class="map-road map-road--horizontal">
              <span class="road-name">Diagonal 74</span>
            </div>
            <div class="map-road map-road--diagonal">
              <span class="road-name">Avenida 7</span>
            </div>
            <div class="map-park map-park--one"></div>
            <div class="map-park map-park--two"></div>
            <div class="map-pin" aria-hidden="true">
              <span></span>
            </div>
            <div class="map-label">Catedral de La Plata</div>
          </div>

          <div class="map-coords">
            <span>Lat: -34.9215</span>
            <span>Lng: -57.9536</span>
          </div>
        </aside>
      </div>

      <form class="contact-form" id="contact-form" novalidate>
        <div class="contact-form__header">
          <h3>Escribinos</h3>
          <p>Te respondemos en la próxima jornada hábil.</p>
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

        <p class="contact-form__message" id="contact-form-message" aria-live="polite"></p>
      </form>
    </section>
  `;

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
