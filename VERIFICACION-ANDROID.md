# Verificación del APK — 30/09/2026

## Entorno y alcance

- Emulador Android 7.0, API 24, x86_64; proveedor WebView Chrome 69.0.3497.100.
- Aplicación horizontal; viewport lógico de prueba 1280 × 640.
- Pruebas complementarias de escritorio a 1366 × 768 con entrada táctil y rutas de compatibilidad forzadas. Previamente se revisó el texto largo a 1920 × 1080.
- APK universal sin bibliotecas nativas específicas de CPU, minSdk 24, targetSdk 36.
- Firma release verificada con esquemas v2 y v3.

## Resultados

| Comprobación | Resultado |
| --- | --- |
| Compilación debug/release y lint vital de Android | Correcta |
| Instalación y arranque en Android 7/API 24 | Correctos |
| 40 preguntas; 10 por cada una de las cuatro categorías | Correcto |
| Contraseña, navegación de administración y regreso al juego | Correctos |
| Toques enviados por ADB: girar y elegir respuesta | Correctos |
| Acierto, error, premio directo y giro extra en emulador | Correctos |
| Tiempo agotado en pruebas web táctiles | Correcto |
| Guardado/recarga y preservación del banco existente | Correctos en pruebas web; banco conservado al recargar en emulador |
| Selector nativo de destino para exportar JSON, con cancelación | Correcto en emulador |
| Sin red activa y APK sin permiso INTERNET | Correcto; ConnectivityService: Active default network: none |
| Excepciones JavaScript durante el recorrido del emulador | Ninguna |
| Contenido del APK: preguntas, logos, GSAP y fuentes | Incluidos localmente |
| Video dentro del APK | Ninguno |
| Permiso INTERNET en el APK | Ausente |

Se corrigieron sectores de ruleta sin color, alineación del botón GIRAR, desplazamiento interno de pantallas y conexión del módulo de exportación, detectados al probar el WebView antiguo.

## Límites que siguen pendientes del dispositivo físico

- No se dispone del TV Box con firmware «Android 7.0.12», por lo que no se certifican su proveedor WebView, GPU, memoria, calibración ni controlador USB del marco táctil.
- El mínimo configurado es WebView 60; la ejecución real antigua verificada fue WebView 69. No se probó cada versión intermedia.
- La reproducción de video, códecs del fabricante y acceso a un pendrive real deben probarse en el equipo. No se incluyó video a petición del usuario.
- Se verificó apertura/cancelación del selector de exportación, no escritura en un pendrive físico.
- Las pruebas fueron recorridos funcionales, no una prueba continua de varias horas. La salida de audio física tampoco se escuchó: el emulador se ejecutó sin dispositivo de sonido.
- Los avisos gráficos EGL del emulador con renderizado por software no son evidencia sobre la GPU del TV Box.
- La auditoría de dependencias de ejecución no reportó vulnerabilidades. La auditoría inicial de herramientas de desarrollo reportó tres avisos moderados en la cadena de `xcode/uuid` del CLI, destinada a iOS; esas herramientas no se empaquetan en el APK Android.

Antes del evento: instalar este APK en el TV Box, comprobar el táctil en todas las zonas, escuchar los sonidos, probar importación/exportación y Loop si se utiliza, y dejarlo funcionando sin red durante una sesión prolongada.
