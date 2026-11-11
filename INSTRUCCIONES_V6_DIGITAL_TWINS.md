# AI Experience 2026 · V6 Digital Twins

## Novedades
- Cuatro nuevas pantallas de Digital Twins: pregunta, encuesta QR con resultados, revelación y hoja de ruta.
- Nueva página `digital-twins-votar.html`.
- Dos encuestas independientes: `seminario2026` (original) y `digitaltwins2026` (nueva).
- La etapa actual es únicamente recolección y preparación de datos; no se afirma que exista un gemelo digital clínico operativo.

## PASO 1 · Crear la segunda encuesta en Firebase
En Firestore Database > Datos > colección `votaciones`, crea un documento con ID EXACTO `digitaltwins2026` y estos campos:
- `titulo` (string): `¿Qué son los Digital Twins?`
- `abierta` (boolean): `true`
- `opciones` (array de strings): `robots`, `modelo_virtual`, `historia_digital`, `interoperabilidad` (opcional para el código, útil como referencia).
No cambies ni borres `seminario2026`.

## PASO 2 · Publicar reglas
En Firestore Database > Reglas, pega TODO el archivo `firestore.rules` de este ZIP y publica. Es una extensión de las reglas V5: permite votar en ambos documentos, manteniendo un voto por UID anónimo y por encuesta.

## PASO 3 · Publicar archivos en GitHub Pages
Sube los archivos y carpetas de esta carpeta a la raíz de `clinicadeoccidente/demo-ia-ti-cdo` (sin subir el ZIP). Debes reemplazar `seminario.html`, `firebase-votacion.js` y `firestore.rules` solo en Firebase (el archivo en GitHub es copia documental); añade `digital-twins-votar.html`. Los paneles existentes se conservan.

## PASO 4 · Probar
- Presentación: https://clinicadeoccidente.github.io/demo-ia-ti-cdo/seminario.html
- Nueva encuesta: https://clinicadeoccidente.github.io/demo-ia-ti-cdo/digital-twins-votar.html
- Votación anterior: https://clinicadeoccidente.github.io/demo-ia-ti-cdo/votar.html
- Navega a las pantallas 7–10 (Digital Twins), escanea QR, vota y verifica resultados. La encuesta original debe seguir funcionando en su pantalla posterior.

## Seguridad y límites
- Modo demo Spark: los votos anónimos son legibles por usuarios autenticados, solo para conteo; no contiene datos personales ni clínicos.
- No hay garantía de un único voto por persona (cambiar sesión/dispositivo puede generar otro UID).
- Las reglas impiden sobrescribir o borrar votos desde el cliente. Para reiniciar, elimina manualmente documentos en `votaciones/digitaltwins2026/votos` desde Firebase Console, sin borrar el documento padre.
- Antes del evento prueba con dos dispositivos, reinicia votos y ten un respaldo sin conexión.
