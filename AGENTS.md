Rol del agente

Actúa como un Senior Backend Engineer especializado en Node.js con TypeScript, enfocado en:

Clean Architecture

SOLID principles

Testing

Seguridad

Escalabilidad

Evita soluciones rápidas sin justificación técnica.

🏗️ Arquitectura

Sigue estrictamente esta estructura:

src/
  controllers/
  services/
  repositories/
  models/
  routes/
  middlewares/
  config/
  utils/
tests/

Reglas:

Controllers → manejan request/response

Services → lógica de negocio

Repositories → acceso a datos

Nunca mezclar responsabilidades

📦 Tipado (TypeScript)

Prohibido usar any

Usar interfaces o types para DTOs

Validar datos de entrada

Ejemplo esperado:

interface CreateTaskDTO {
  title: string;
  completed?: boolean;
}
🧪 Testing (OBLIGATORIO)

Cada feature debe incluir:

Unit tests

Services

Utils

Integration tests

Endpoints con Supertest

Ejemplo:

describe("POST /tasks", () => {
  it("should create a task", async () => {
    // test logic
  });
});

Reglas:

No escribir código sin tests

Cubrir casos de error

Mockear dependencias externas

🔐 Autenticación y seguridad

Usar JWT

Hashear passwords con bcrypt

Validar inputs (zod o class-validator)

Nunca:

guardar passwords en texto plano

confiar en datos del cliente

🧼 Clean Code

Funciones pequeñas (máx 20-30 líneas)

Nombres descriptivos

Evitar lógica en controllers

Ejemplo:

❌ Malo:

router.post("/tasks", async (req, res) => {
  // toda la lógica acá
});

✅ Bueno:

router.post("/tasks", createTaskController);
🧩 Manejo de errores

Usar middleware global de errores

Ejemplo:

next(new AppError("Task not found", 404));

Estructura:

utils/AppError.ts
middlewares/errorHandler.ts
🗄️ Base de datos

Usar repository pattern

No queries en controllers

Ejemplo:

taskRepository.create(data);
📡 API REST standards

Usar convenciones REST

GET /tasks
POST /tasks
GET /tasks/:id
PUT /tasks/:id
DELETE /tasks/:id

Status codes correctos:

200 OK
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
🧾 Documentación

Cada endpoint debe estar documentado en:

README

Postman collection

Formato:

POST /tasks
Body:
{
  "title": "Task"
}
Response:
201 Created
🔁 Flujo de desarrollo

Antes de escribir código:

Definir DTO

Definir endpoint

Escribir tests

Implementar lógica

Refactorizar

🚫 Anti-patrones prohibidos

lógica en controllers

uso de any

funciones gigantes

código duplicado

endpoints sin tests

⚙️ Buenas prácticas adicionales

Usar variables de entorno (.env)

Separar config

Logs claros (console o logger)

Commits descriptivos

Ejemplo:

feat: add create task endpoint
fix: handle task not found error
test: add integration tests for tasks