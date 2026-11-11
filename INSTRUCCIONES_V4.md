# AI Experience 2026 · v4

## Presentar
1. Descomprime el ZIP.
2. Abre una terminal en la carpeta y ejecuta `python servidor.py` (Windows también admite `py servidor.py`).
3. Abre `http://localhost:8765/seminario.html` en el computador del presentador.
4. Pulsa F para pantalla completa; usa flechas izquierda/derecha.
5. En la diapositiva de votación, los asistentes escanean el QR con el celular, conectado a la misma Wi-Fi.
6. Para mostrar el QR instala `pip install qrcode[pil]` si no está disponible. También se puede compartir la URL mostrada en la terminal.

## Importante
- Abrir `seminario.html` con doble clic **no** habilita votación real.
- La Wi-Fi del hotel debe permitir comunicación entre dispositivos; algunas redes de invitados la bloquean. Para una audiencia grande o remota se requiere desplegar un backend público HTTPS.
- El servidor de ejemplo es para ensayos en una red controlada; no tiene autenticación, limitación de tasa ni persistencia. No publicarlo en Internet sin endurecimiento de seguridad.
- Un voto por cookie/navegador (no es garantía de un voto por persona). Los votos se reinician al apagar el servidor.
- No usar datos reales de pacientes.
- La presentación y las seis demos anteriores permanecen en el paquete.
