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
- `motion.js`: transiciones GSAP, transformación del lettering, giro y celebración; se cancela al navegar. Los ticks responden al paso real de cada segmento.
- `motion.css`: contención del botón y separación entre motion GSAP y feedback táctil CSS.
- `components.js` y `content.js`: componentes y parámetros visuales.
- `styles.css` y `theme.css`: responsive y estética.
- `assets/`: logos, lettering y tipografía con licencia.

Consultar `LEEME.md` y `DESIGN.md` para detalles de uso y decisiones visuales. Desarrollo en curso; este repositorio no implica una publicación web.

GSAP 3.13.0 se sirve desde `assets/vendor/gsap.min.js`, con su aviso de licencia original y metadatos del paquete. No requiere CDN ni instalación de dependencias. El giro usa `spinDuration` de `content.js`; la selección sigue perteneciendo a `app.js`. El cambio de pantalla espera a que termine el giro. La preferencia de movimiento reducido reemplaza el giro por una breve espera mostrando su posición final. El lettering viaja entre los límites reales de ambos logos y vuelve al reiniciar. El botón GIRAR mantiene un pulso mientras espera interacción; se cancela al salir de la ruleta y se omite con movimiento reducido.

## Video del stand

Configuración tiene las opciones Preguntas y Loop. En Loop, seleccionar un MP4 o WebM (hasta 500 MB), revisar la vista previa y tocar Iniciar loop. Iniciar loop solicita pantalla completa del navegador; si el entorno no la permite, ocupa toda la vista de la aplicación. El video llena la pantalla sin franjas (puede recortar bordes si su proporción es diferente), se repite sin sonido y permite regresar con el icono × de 44 px en la esquina superior. Al salir se restaura el modo de pantalla anterior. Se conserva como archivo en IndexedDB, separado del banco de preguntas, sin subirlo a ningún servidor. Se mantiene al recargar en el mismo navegador y dirección local; no forma parte de la exportación de preguntas. Conservar el original para otros dispositivos o si se borran los datos del navegador. `video-loop.js` administra carga, validación, persistencia y liberación de recursos; `video-loop.css` define ambas vistas.

## Categorías

Configuración → Preguntas permite renombrar las primeras cuatro categorías (hasta 28 caracteres). Los nombres se guardan localmente y los índices de las preguntas no cambian. Premio Sorpresa y Gira de nuevo son fijas y participan sin preguntas: premio directo con retorno automático o nueva oportunidad de girar. Las preguntas antiguas en los índices 4 y 5 se conservan en el banco, pero deben reasignarse para participar. Los nombres personalizados se guardan aparte del JSON de preguntas.
