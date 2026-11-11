# AI Experience 2026 — Firebase (prototipo Spark)

1. En Firestore > Reglas, reemplazar reglas por el contenido de `firestore.rules` y publicar. Las reglas anteriores NO permiten consultar los resultados; este cambio es necesario para el prototipo.
2. En Authentication > Configuración > Dominios autorizados, añadir `clinicadeoccidente.github.io` si no aparece. No agregar rutas ni https.
3. Subir TODOS los archivos y carpeta `paneles` a una rama de prueba o sitio de GitHub Pages. Conservar las rutas relativas.
4. Abrir `seminario.html` desde HTTPS (no file://). La diapositiva 7 genera un QR a `votar.html`.
5. Probar con dos navegadores/celulares. La cuenta anónima de cada navegador puede votar una vez por encuesta.
6. Para cerrar la encuesta, cambiar manualmente `abierta` a false desde Firebase Console. Para reabrir, true. Para repetir la encuesta, eliminar los documentos de la subcolección votos desde la consola (solo en pruebas).

## Límites de seguridad y privacidad
Esta variante usa Firestore en plan Spark SIN servidor de agregación. Para mostrar el conteo en tiempo real, cualquier usuario autenticado anónimamente puede consultar los documentos de votos, incluidos sus identificadores anónimos de Firebase. No se almacenan nombres ni datos de pacientes, pero los identificadores son seudónimos. No es un escrutinio privado ni resistente a fraude: alguien puede crear identidades anónimas adicionales. No usar para votaciones sensibles o producción de alta confianza. Para conteo agregado sin exponer registros individuales, usar un backend confiable (por ejemplo Cloud Functions con plan Blaze) que mantenga un documento de resultados público de solo lectura.

El QR requiere cargar la biblioteca QRCode desde CDN; con Internet bloqueado se muestra el enlace. No requiere Python. El contenido existente de las demostraciones se conserva.
