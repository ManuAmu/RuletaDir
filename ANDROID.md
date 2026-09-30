# La Bibliodera para TV Box

Rama `Apk`. Conserva la versión web y añade empaquetado Android con Capacitor 8.5.2.

## Instalación

1. Copiar `releases/La-Bibliodera-1.0.apk` al pendrive.
2. Abrirlo desde el administrador de archivos del TV Box y autorizar la instalación desde esa aplicación cuando Android lo solicite.
3. Abrir La Bibliodera. Incluye 40 preguntas (10 por categoría), funciona sin Internet y no incluye video.
4. Configuración solicita la contraseña indicada por el equipo. La protección es un bloqueo local de operación, no autenticación de servidor.
5. Para usar Loop, elegir un MP4/WebM desde el selector del equipo. El archivo se guarda en IndexedDB; conservar su original. El acceso al USB depende del proveedor de archivos del fabricante.

El APK requiere Android API 24 o posterior y WebView/Chrome 60 o posterior. Se verificó en emulador Android 7.0/API 24 con proveedor Chrome/WebView 69.0.3497.100. No se verificó el firmware específico llamado «7.0.12» ni el marco táctil físico del TV Box. Un dispositivo con WebView inferior al mínimo necesita actualizar ese componente; el APK no incluye un motor web propio.

## Datos

Las preguntas se incluyen como recursos locales y se guardan al primer inicio. Las ediciones permanecen en la aplicación. No se transfieren automáticamente los datos de Chrome/Edge de la PC al APK. Exportar/importar JSON permite trasladar preguntas; el video y los nombres personalizados de categorías no forman parte de ese JSON.

No desinstalar para actualizar una instalación con datos: usar un APK del mismo identificador y firma. Desinstalar o borrar los datos del sistema elimina el banco y el video locales. Guardar copias desde Configuración.

## Comportamiento Android

- Orientación horizontal, modo inmersivo y pantalla encendida mientras la aplicación está abierta.
- Botón Atrás retorna a la ruleta; en la ruleta no cierra accidentalmente el juego. Se puede salir desde los controles del sistema.
- Exportación JSON mediante el selector nativo de archivos; no requiere permiso general de almacenamiento.
- Sin permiso INTERNET ni servidor externo. GSAP, fuentes, logos y preguntas van dentro del APK.
- JavaScript compilado para Chrome 60 y adaptaciones locales para APIs ausentes, disposición, sectores SVG y unidades CSS recientes. La versión web original conserva sus hojas de estilo.

## Reproducir compilación

Requisitos de desarrollo: Node 22+, JDK 21, Android SDK plataforma 36. El SDK de compilación no cambia el mínimo de instalación (24).

```sh
npm ci
npm run android:sync
cd android
./gradlew assembleDebug assembleRelease
```

En Windows usar `gradlew.bat`. Configurar `JAVA_HOME` y `android/local.properties` con la ruta `sdk.dir` del SDK. El APK release generado por Gradle es sin firma; firmarlo con `apksigner` y la clave privada de publicación. No se versionan claves ni contraseñas. La firma entregada usa esquemas v2/v3 compatibles con Android 7.

## Verificación

`npm test` compila los recursos web y ejecuta pruebas táctiles de escritorio con Playwright/Edge, incluyendo las rutas de compatibilidad. No equivale a ejecutar un WebView antiguo.

`scripts/test-android.cjs` prueba el APK debug instalado en un emulador mediante ADB y el protocolo de depuración de su WebView. Definir `ADB` y reenviar su socket DevTools al puerto 9223. El APK release no habilita depuración.

Ver `VERIFICACION-ANDROID.md` para alcance y limitaciones. El instalador entregado incluye su hash en `releases/SHA256.txt`.
