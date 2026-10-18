<!--
Sync Impact Report
Version change: uninitialized -> 1.0.0 (initial constitution)
Modified principles: none; established five principles from the DevHub project rules
Added sections: Technology and Security Constraints; Development Workflow
Removed sections: none
Follow-up TODO: none.
-->

# DevHub Constitution

## Core Principles

### I. Modular Architecture and Stack
The frontend MUST use Angular 21 and the backend MUST use NestJS 12. Persistence MUST
use MongoDB with Mongoose, and TypeScript strict mode MUST remain enabled. The backend
MUST organize functionality into modules with separate schemas, DTOs, controllers,
services, modules, and business-rule files as applicable. The frontend MUST separate
code into the `Entidades/`, `Servicios/`, `Controlador/`, `Componentes/`,
`Formularios/`, `Paginas/`, and `Utils/` areas. A feature MUST NOT be implemented as
one monolithic file.

### II. Pure Business Rules and Documented Code
Business rules MUST live in `*.reglas.ts` files and MUST NOT access the database.
Classes, methods, decorators, and libraries MUST have comments explaining their
purpose. This separation keeps business behavior independently testable and makes
the codebase understandable.

### III. Test-First Business Rules
Each business rule identified as RN-01 through RN-06 MUST have a corresponding test
in `*.reglas.spec.ts` written before its implementation. Development MUST follow the
red-green-refactor cycle: first demonstrate the rule's failure, then implement the
smallest passing change, then refactor while keeping tests green.

### IV. Secure Defaults
Passwords MUST be hashed with bcrypt. Authentication tokens MUST be JWTs with an
eight-hour lifetime. Incoming data MUST be validated through DTOs with whitelist
validation enabled. Secrets MUST be stored only in `.env` files and MUST NOT be
committed to source control.

### V. Mobile-First Experience
Every screen MUST remain usable at a viewport width of 360 px. Layout, controls, and
content MUST be verified at that width so core tasks do not require a larger screen.

## Technology and Security Constraints
The stack, module boundaries, strict TypeScript setting, pure-rule location,
documentation requirements, authentication controls, and input-validation
requirements in the Core Principles apply to every feature. New dependencies and
application code MUST follow the existing project conventions and remain within the
frontend/backend separation.

## Development Workflow
Changes MUST reach `main` only through a Pull Request with a green pipeline and at
least one approval from another person. Commits MUST use Conventional Commits with
the applicable `feat`, `fix`, `test`, `docs`, or `ci` type, for example
`feat(modulo): ...` or `docs: ...`.

## Governance
This constitution governs specifications, implementation, review, and delivery.
Contributors MUST review proposed changes for compliance with these principles, and
Pull Request reviewers MUST identify any deviation and require either correction or
a constitution amendment before merge.

Amendments MUST be made through a reviewed Pull Request that explains the rationale,
scope, and impact on existing work. The constitution version MUST follow semantic
versioning: MAJOR for incompatible governance changes or removal/redefinition of a
principle, MINOR for a new principle or materially expanded guidance, and PATCH for
clarifications or non-semantic edits. Compliance MUST be checked during
specification and Pull Request review; automated tests and pipeline checks MUST
verify applicable requirements where feasible.

**Version**: 1.0.0 | **Ratified**: 2026-10-18 | **Last Amended**: 2026-10-18
