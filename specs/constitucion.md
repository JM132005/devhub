# Constitución de DevHub

> Reglas que **todo** el código y toda spec deben respetar. Pega este texto en `/speckit.constitution`
> después de ejecutar `specify init --here --ai copilot`.

1. **Stack:** Angular 21 (frontend), NestJS 12 (backend), MongoDB con Mongoose, TypeScript estricto.
2. **Arquitectura separada:** backend por módulos (`esquemas/ dto/ *.controller *.service *.module *.reglas`); frontend por carpetas (`Entidades/ Servicios/ Controlador/ Componentes/ Formularios/ Paginas/ Utils/`). Nunca todo en un archivo.
3. **Comentarios:** cada clase, método, decorador y librería lleva un comentario que explique qué hace.
4. **Reglas de negocio puras:** viven en `*.reglas.ts`, sin acceso a base de datos, para poder probarlas.
5. **TDD:** toda regla (RN-01…RN-06) tiene su prueba en `*.reglas.spec.ts` **antes** de implementarse. Ciclo rojo → verde → refactor.
6. **Flujo:** ningún cambio llega a `main` sin Pull Request, pipeline en verde y 1 aprobación de otra persona.
7. **Seguridad:** contraseñas con bcrypt, sesión con JWT (8 h), validación de entrada con DTO + `whitelist`, secretos solo en `.env`.
8. **Móvil primero:** toda pantalla debe usarse cómodamente en un celular de 360 px.
9. **Commits:** Conventional Commits → `feat(modulo): ...`, `fix(...)`, `test(...)`, `docs: ...`, `ci: ...`.
