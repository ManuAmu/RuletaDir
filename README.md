# La Bibliodera

Experiencia táctil para la Dirección de la Juventud y Santiago Ciudad. HTML, CSS y JavaScript, sin dependencias de ejecución externas.

## Ejecutar

Abrir `index.html` en Edge o Chrome, o servir esta carpeta con un servidor HTTP local. La vista previa de desarrollo usa http://127.0.0.1:8765.

## Cargar contenido

Desde el engranaje se pueden agregar y editar preguntas, marcar la respuesta correcta y guardar el tiempo junto con la pregunta. Los datos quedan en el navegador y se pueden exportar/importar como JSON. No se incluyen preguntas reales ni datos del navegador en Git.

## Recorrido

Ruleta → categoría → pregunta con tiempo → resultado → regreso automático a la ruleta después de 4 segundos. Incluye sonido con silencio persistente, animaciones y soporte de movimiento reducido.

## Archivos

- `app.js`: navegación y ronda.
- `settings.js`: carga manual y persistencia.
- `sound.js`: audio sintetizado localmente.
- `components.js` y `content.js`: componentes y parámetros visuales.
- `styles.css` y `theme.css`: responsive y estética.
- `assets/`: logos, lettering y tipografía con licencia.

Consultar `LEEME.md` y `DESIGN.md` para detalles de uso y decisiones visuales. Desarrollo en curso; este repositorio no implica una publicación web.
