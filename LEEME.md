# LA BIBLIODERA · Versión final local

## Empezar

Abrí `index.html` en Edge o Chrome. No necesita instalación ni conexión a internet. También se puede servir la carpeta por HTTP, como en la vista previa local. Usá siempre el mismo navegador y dirección para conservar el banco local.

1. Entrá en **Configuración**, arriba a la derecha.
2. Elegí una categoría, escribí la pregunta, completá las cuatro opciones y marcá la correcta.
3. Elegí el tiempo de respuesta entre 5 y 120 segundos (15 por defecto); se aplica a todas las preguntas.
4. Tocá **Guardar pregunta y tiempo** para guardar ambos juntos. Podés editar o eliminar cada pregunta del listado.
5. Volvé al juego y tocá **GIRAR** en el centro de la ruleta.

El proyecto incluye 40 preguntas aprobadas por el equipo: 10 por cada categoría de preguntas. Se cargan al iniciar por primera vez, sin reemplazar bancos ya guardados. Podés editarlas desde Configuración. La copia preguntas-bibliodera.json permite importarlas en otro equipo; esa importación reemplaza el banco después de confirmar. Las respuestas admiten hasta 120 caracteres.

## Recorrido

Partida de 3 preguntas: ruleta → categoría → pregunta → devolución → ruleta para la siguiente pregunta. Ganás al completar 3 respuestas correctas. El primer error termina inmediatamente la partida, sin presentar las preguntas restantes. El tiempo agotado también termina la partida. Premio Sorpresa mantiene su premio directo y Gira de nuevo permite otro giro: ninguno consume una pregunta ni cambia el marcador. Al finalizar se vuelve automáticamente a una partida nueva. Entrar a Configuración o recargar cancela la partida en curso, pero conserva el historial de preguntas utilizadas.

Solo se seleccionan categorías con preguntas cargadas. La ruleta se detiene sobre la categoría elegida. Cada categoría agota sus preguntas antes de repetirlas, con historial guardado al cerrar. El nuevo ciclo no comienza con la última pregunta del anterior; si una categoría tiene una sola pregunta, necesariamente se repite. La opción correcta es la marcada en Configuración; ya no depende de la letra A.

El tiempo aparece en una barra debajo de la pregunta y encima de las respuestas, con segundos numéricos. Los últimos cinco segundos se muestran en coral. Responder detiene el reloj; si vence el plazo, no se aceptan respuestas tardías. Entrar a Configuración cancela la ronda actual.

## Guardado y respaldo

Las preguntas y el tiempo se guardan en el almacenamiento local del navegador. No se sincronizan con otros dispositivos. Borrar los datos del navegador puede borrar el banco. En navegación privada pueden perderse al cerrar la sesión.

**Exportar copia** descarga un JSON con preguntas y tiempo. **Importar copia** permite recuperarlo en otro dispositivo; pide confirmación antes de reemplazar el banco. La interfaz valida campos, límites y formato. Permite hasta 500 preguntas, 160 caracteres por pregunta y 120 por respuesta.

Configuración requiere la contraseña Absalon248. Al volver al juego o recargar, el acceso vuelve a bloquearse. Esta versión funciona localmente, sin backend ni cuentas.

## Diseño y organización

Paleta rojo escenario, vino, crema y amarillo cálido; tipografía Barlow Condensed ExtraBold local y Trebuchet MS. Botones táctiles amplios, estados explícitos, contraste alto y soporte para movimiento reducido. Principalmente 1920×1080; en móviles el contenido se apila con desplazamiento vertical.

- `index.html`: estructura y acceso a configuración.
- `styles.css`: estructura, barra y adaptación de pantallas.
- `theme.css`: paleta roja, tipografía, profundidad y animaciones.
- `DESIGN.md`: decisiones de diseño y verificación.
- `content.js`: categorías y duración de giro/anuncio.
- `components.js`: ruleta, botones y recursos visuales.
- `settings.js`: formulario, validación, almacenamiento y respaldos.
- `app.js`: selección de pregunta, navegación y temporizadores.

Sin dependencias externas de ejecución. La identidad tipográfica es una propuesta, no un logo oficial recibido.

## Verificación

Comprobación en Edge: carga manual, edición, persistencia tras recarga, exportación, eliminación confirmada, importación, categoría correspondiente, respuesta correcta configurable, vencimiento de tiempo y configuración en móvil. Las pruebas usan un navegador aislado y no agregan preguntas al banco del usuario.

Se recomienda la última revisión presencial de legibilidad, reflejos y respuesta táctil sobre el dispositivo del evento.

Actualización institucional: logo de Juventud en el encabezado y Municipalidad centrado en el pie; se retiró la frase del pie. Diseño principal para TV horizontal táctil, con título centrado en su bloque y ruleta a la derecha; en vertical y móvil se apilan. Portada verificada en 1920×1080, 1080×1920 y 390×844 sin desbordes. Los PNG originales se conservan en assets; sus márgenes transparentes se ajustan con CSS.


## Sonido y animaciones

El botón de audio del encabezado permite silenciar o activar los efectos y recuerda la preferencia. El audio comienza tras una interacción con la pantalla, de acuerdo con las reglas del navegador. Se sintetiza localmente: clics de giro, anuncio de categoría, fanfarria de acierto, derrota, cuenta regresiva y tiempo agotado. Al cambiar de pantalla se cancelan los sonidos pendientes.

Las animaciones de presentación y resultado ahora duran hasta 700 ms; el acierto incluye confeti breve. Las respuestas permanecen estáticas y se respeta movimiento reducido. Verificado el flujo de acierto/error, generación de confeti y persistencia de silencio; ajustar el volumen físico en la TV antes del evento.

El nombre oficial es La Bibliodera. Se mantiene únicamente la clave interna antigua de almacenamiento para conservar las preguntas ya cargadas.

Comportamiento vigente: no hay botón Volver a jugar en los resultados. Acierto, error y tiempo agotado regresan automáticamente a la ruleta después de 4 segundos (resultDuration en content.js). Desarrollo en curso.


## Probabilidades locales

Con las cuatro categorías de preguntas cargadas: 22,5 % cada una; Premio Sorpresa 5 % y Gira de nuevo 5 %. Los pesos se definen en content.js. Si una categoría queda sin preguntas, se excluye y se redistribuyen proporcionalmente los pesos disponibles.
