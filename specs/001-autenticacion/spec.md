# SPEC 001 · Autenticación y usuarios

**Estado:** Aprobada · **Issues:** #5, #6 · **Módulos:** `backend/src/modulos/auth`, `usuarios`

## Contexto
Hoy cualquiera puede tocar cualquier cosa y no se sabe quién hizo qué. Cada persona necesita una cuenta con un rol.

## Historias de usuario
- **HU-01** Como usuario, quiero iniciar sesión con correo y contraseña, para acceder a mis proyectos.
- **HU-02** Como administrador, quiero crear usuarios y asignarles un rol, para controlar quién hace qué.

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-01 | Login con correo + contraseña devuelve un token JWT válido por 8 horas. |
| RF-02 | Las contraseñas se guardan cifradas con bcrypt (nunca en texto plano). |
| RF-03 | Roles: `ADMIN`, `LIDER`, `DESARROLLADOR`. |
| RF-04 | Solo `ADMIN` crea usuarios, cambia roles o desactiva cuentas. |
| RF-05 | Un usuario desactivado no puede iniciar sesión. |
| RF-06 | Toda ruta, salvo login y salud, exige token. |

## Criterios de aceptación
- Dado un correo y contraseña correctos, cuando inicio sesión, entonces recibo un token.
- Dada una contraseña incorrecta, cuando inicio sesión, entonces recibo error **401** con un mensaje que no revela si el correo existe.
- Dada una petición sin token a `/api/proyectos`, entonces recibo **401**.
- Dado un DESARROLLADOR, cuando intenta crear un usuario, entonces recibe **403**.

## Contrato API
| Método | Ruta | Rol |
|---|---|---|
| POST | `/api/auth/login` | público |
| GET | `/api/auth/perfil` | conectado |
| GET | `/api/usuarios` | conectado |
| POST | `/api/usuarios` | ADMIN |
| PATCH | `/api/usuarios/:id` | ADMIN |

## Fuera de alcance
Recuperar contraseña por correo, inicio de sesión con GitHub (fase 2).
