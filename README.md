# ExploraMundo

**Integrantes:** Federico Busum Fradera y Matías Galván  
**Link en GitHub Pages:** [https://fedebf03.github.io/ExploraMundo/](https://fedebf03.github.io/ExploraMundo/)

---

## Cómo levantar el proyecto en local

### Requisitos previos
* Node.js instalado (versión 18 o superior).
* Git para clonar el repositorio.

### Pasos de ejecución
1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar la API Key:**
   Crear un archivo `.env` en la raíz del proyecto tomando como base el archivo `.env.example`:
   ```env
   VITE_API_URL=https://api.restcountries.com/countries/v5
   VITE_API_KEY=tu_api_key_aca
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá automáticamente en `http://localhost:3000/ExploraMundo/`.

---

## Enfoque y decisiones técnicas

**ExploraMundo** es una web app de turismo y países que consume la API de REST Countries (v5) para buscar destinos, ver información detallada de cada país y guardar favoritos.

### Tecnologías utilizadas
* **Lenguajes y herramientas:** TypeScript, HTML5 semántico, CSS3 nativo y Vite.
* **APIs del navegador:** Fetch API, `localStorage` y Geolocation API (`navigator.geolocation`).
* **Librerías externas:** Leaflet.js sobre OpenStreetMap para los mapas interactivos.
* **PWA:** Web App Manifest, Service Worker y Cache Storage para el soporte offline.

### Elección del stack
Desarrollamos la app con **TypeScript** y Vite. Para la navegación tipo SPA (Single Page Application) sin recargar la página, armamos un enrutador propio basado en el evento `hashchange`. El router escucha los cambios de ruta (como `#/busqueda`, `#/detalle/ARG` o `#/favoritos`), selecciona la vista que corresponde y muestra el contenido adentro de `<main id="app">`.

### Estructura del proyecto
Organizamos el código en carpetas según su función:
* `src/services/`: Peticiones a la API externa (`api.service.ts`) y manejo de `localStorage` (`storage.service.ts`).
* `src/views/`: Las distintas pantallas de la app (`home`, `busqueda`, `detalle`, `favoritos`, `historial`, `contacto`).
* `src/components/`: Componentes reutilizables de la interfaz, como las tarjetas de países, el modal de confirmación, el loader y los mensajes de error.
* `src/styles/`: Estilos CSS modulares organizados por base, componentes, layout y vistas, usando variables CSS para colores y tipografía.

### Diseño Mobile-First con CSS nativo
El diseño responsivo está armado con CSS nativo (Flexbox y CSS Grid), siguiendo un enfoque Mobile-First:
* En celulares en vertical (hasta 480px), las grillas se muestran a 1 columna para facilitar la lectura y el uso con una mano.
* En celulares en horizontal y tablets (481px a 1023px), la distribución pasa a 2 o 3 columnas.
* En pantallas de escritorio (más de 1024px), el contenido se distribuye en 4 columnas con un ancho máximo contenido.

También sumamos una barra de navegación inferior (`bottom-nav`) fija para celulares y un botón flotante para volver arriba al hacer scroll.

### Funcionalidades principales
* **Inicio (Home):** Trae 12 países aleatorios desde la API calculando un `offset` al azar, junto a un botón para ir directo al buscador.
* **Búsqueda y paginación:** Permite buscar por nombre o capital, continente e idioma (combinando los tres filtros a la vez). Implementa paginación progresiva con `limit` y `offset`, sumando de a 12 países con el botón "Cargar más destinos" según el total que devuelve la API.
* **Detalle de país y mapa:** Consulta la API por código ISO (`alpha_3` o `alpha_2`). Muestra los datos del país, botones para navegar a los países limítrofes y un mapa con Leaflet centrado en las coordenadas del destino, trazando una línea hasta la ubicación del usuario usando `navigator.geolocation`.
* **Favoritos e historial (`localStorage`):**
  * **Favoritos:** Formulario modal para guardar países con prioridad (1 a 5), categoría y nota. Si el usuario decide eliminar un favorito, la app le pide confirmación antes de borrarlo.
  * **Historial:** Registra automáticamente cada país visitado en orden cronológico inverso (hasta 12 elementos, sin repetir).
* **Contacto:** Mapa interactivo con Leaflet que ubica la oficina y traza la distancia hasta el usuario mediante geolocalización. Incluye un formulario de consultas validado con JavaScript (campos obligatorios, límites de caracteres y formato de email con regex) con mensajes dinámicos de error y éxito.

### Consumo de API y manejo de errores
Consumimos la API de REST Countries usando Fetch API, controlando tanto caídas de conexión (`try/catch`) como errores de respuesta del servidor (`response.ok`). Si la petición falla, la interfaz muestra un mensaje claro con un botón para reintentar la carga.

### Soporte PWA y modo offline
La aplicación está configurada como Progressive Web App instalable con soporte offline:
* **Manifest:** Archivo `manifest.json` con modo `standalone`, colores de tema e íconos en 192px y 512px (incluyendo variante `maskable`).
* **Service Worker:** En `pwa-init.ts` registramos el Service Worker (`sw.js`), que precachea los recursos del App Shell (HTML, estilos, script principal y manifest) con estrategia Cache First en el evento `install`.
* **Funcionamiento offline:** La app carga sin conexión gracias a la caché del Service Worker, permitiendo navegar y consultar Favoritos e Historial desde `localStorage`.

