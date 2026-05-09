# Caso de validación manual

## Caso único: flujo completo del MVP

Objetivo: comprobar que el MVP permite administrar eventos, consultarlos,
inscribirse y ver recordatorios.

Precondiciones:

- La app corre en `http://localhost:3000`.
- El SQL de `supabase/schema.sql` ya fue ejecutado en Supabase.
- Existe el usuario admin `admin@tecmilenio.mx` con rol `admin`.
- Existe o se puede crear un usuario normal desde la pantalla de registro.

Pasos:

1. Inicia sesión con `admin@tecmilenio.mx`.
2. Entra a `Admin`.
3. Crea un evento con título, descripción, fecha futura, ubicación y categoría.
4. Verifica que el evento aparezca en la lista del panel admin.
5. Edita el evento y cambia la ubicación o descripción.
6. Ve a `Eventos` y confirma que el evento aparece actualizado.
7. Cierra sesión.
8. Registra un usuario normal con nombre, correo y contraseña.
9. Inicia sesión con ese usuario normal.
10. En `Eventos`, presiona `Inscribirme` en el evento creado.
11. Confirma que aparece la etiqueta `Inscrito` y el botón cambia a `Cancelar inscripción`.
12. Entra a `Mis inscripciones`.
13. Verifica que el evento aparece en `Recordatorios próximos`.
14. Cancela la inscripción desde `Mis inscripciones`.
15. Regresa a `Eventos` y verifica que el evento vuelve a mostrar `Inscribirme`.

Resultado esperado:

- El administrador puede crear y editar eventos.
- El usuario normal puede ver eventos.
- El usuario normal puede inscribirse una sola vez al mismo evento.
- La inscripción aparece como recordatorio.
- El usuario puede cancelar su inscripción.
- El panel `Admin` no aparece para usuarios normales.
