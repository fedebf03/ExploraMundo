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
            <input type="text" name="name" placeholder="Tu nombre" maxlength="60" required />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" name="email" placeholder="tu@email.com" maxlength="100" required />
          </label>
        </div>

        <label class="field">
          <span>Asunto</span>
          <input type="text" name="subject" placeholder="¿Sobre qué querés hablar?" maxlength="100" required />
        </label>

        <label class="field">
          <span>Mensaje</span>
          <textarea name="message" rows="5" placeholder="Contanos tu idea, proyecto o consulta..." maxlength="500" required></textarea>
        </label>


        <div class="contact-form__actions">
          <button type="submit" class="btn btn-primary">Enviar mensaje</button>
        </div>

        <p class="contact-form__message" id="contact-form-message" aria-live="polite"></p>
      </form>
    </section>
  `;

  setTimeout(() => {
    const mapElement = document.getElementById('contact-map');
    if (!mapElement || typeof L === 'undefined') return;

    try {
      const officeLocation: [number, number] = [officeCoords.lat, officeCoords.lng];
      const map = L.map('contact-map', {
        scrollWheelZoom: false,
      }).setView(officeLocation, 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // punto de la oficina
      L.marker(officeLocation, {
        title: studioName,
      }).addTo(map);

      // ubicacion del usuario si da permiso
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: [number, number] = [position.coords.latitude, position.coords.longitude];

            // punto del usuario
            L.circleMarker(userLocation, {
              radius: 8,
              fillColor: '#0284c7',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.95,
            }).addTo(map);

            // linea punteada entre ambos puntos
            L.polyline([userLocation, officeLocation], {
              color: '#0284c7',
              weight: 3,
              opacity: 0.75,
              dashArray: '8, 8',
            }).addTo(map);

            // encuadramos ambos puntos en el mapa
            map.fitBounds(L.latLngBounds([userLocation, officeLocation]), {
              padding: [45, 45],
              maxZoom: 15,
            });
          },
          () => {},
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }

      // reajuste del mapa al cargar
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    } catch (err) {
      console.error('Error al inicializar el mapa:', err);
    }
  }, 50);



  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const message = document.getElementById('contact-form-message');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const setFormMessage = (text: string, type: 'error' | 'success') => {
    if (!message) return;
    message.textContent = text;
    if (type === 'error') {
      message.classList.remove('contact-form__message--success');
      message.classList.add('contact-form__message--error');
    } else {
      message.classList.remove('contact-form__message--error');
      message.classList.add('contact-form__message--success');
    }
  };

  const clearFormMessage = () => {
    if (!message) return;
    message.textContent = '';
    message.classList.remove('contact-form__message--error');
    message.classList.remove('contact-form__message--success');
  };

  // Limpiar mensaje de error cuando el usuario modifica algún campo
  form?.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      if (message?.classList.contains('contact-form__message--error')) {
        clearFormMessage();
      }
    });
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const messageText = String(formData.get('message') || '').trim();

    // 1. Validar que todos los campos estén completos
    if (!name || !email || !subject || !messageText) {
      setFormMessage('Completá todos los campos obligatorios para enviar tu consulta.', 'error');
      return;
    }

    // 2. Validar que el nombre tenga una longitud mínima razonable
    if (name.length < 2) {
      setFormMessage('Por favor, ingresá un nombre válido (al menos 2 caracteres).', 'error');
      return;
    }

    // 3. Validar formato de correo electrónico
    if (!emailRegex.test(email)) {
      setFormMessage('Por favor, ingresá un correo electrónico válido (ejemplo: usuario@correo.com).', 'error');
      return;
    }

    // 4. Validar que el mensaje tenga contenido suficiente
    if (messageText.length < 5) {
      setFormMessage('Por favor, ingresá un mensaje más descriptivo (al menos 5 caracteres).', 'error');
      return;
    }

    // Si todas las validaciones pasaron con éxito
    setFormMessage(`Gracias ${name}, tu mensaje fue enviado correctamente.`, 'success');
    form.reset();
  });
}

