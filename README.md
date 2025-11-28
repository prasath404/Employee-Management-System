# Employee Management System

Full-stack CRUD application built with Spring Boot 3, MySQL, and a React (Vite) frontend. The system exposes REST APIs for managing employees, includes service/DTO layers with validation, automated tests, and Docker support for local or containerized development.

## Project structure

```
employee-backend/   # Spring Boot service, DTOs, validation, tests, Dockerfile
employee-frontend/  # Vite + React SPA with Bootstrap styling and Axios service layer
docker-compose.yml  # Spins up MySQL, backend, and nginx-hosted frontend
```

## Tech stack

- Java 17, Spring Boot 3.1, Spring Data JPA (Hibernate 6), Validation API
- MySQL 8 (H2 for integration tests)
- React 18, Vite, React Router, Axios, Bootstrap 5
- Docker + docker-compose

## Backend (employee-backend)

```bash
cd employee-backend
# Compile & run tests
./mvnw test
# Run locally (requires MySQL running and env vars, defaults shown below)
MYSQL_PASSWORD=password ./mvnw spring-boot:run
```

Key environment variables (defaults set in `application.properties`):

| Variable | Default | Description |
| --- | --- | --- |
| `MYSQL_HOST` | `localhost` | Database host |
| `MYSQL_PORT` | `3306` | Database port |
| `MYSQL_DATABASE` | `employee_db` | Schema name |
| `MYSQL_USER` | `root` | Database username |
| `MYSQL_PASSWORD` | `password` | Database password |
| `SERVER_PORT` | `8080` | Spring Boot port |

### API quick reference

- `GET /api/employees` – list all employees
- `GET /api/employees/{id}` – fetch one employee
- `POST /api/employees` – create (body = `EmployeeDTO`)
- `PUT /api/employees/{id}` – update
- `DELETE /api/employees/{id}` – delete

Sample cURL calls:

```bash
# Create
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane@example.com","department":"Engineering","salary":8000,"dateOfJoining":"2023-10-01"}'

# Fetch all
curl http://localhost:8080/api/employees
```

## Frontend (employee-frontend)

```bash
cd employee-frontend
npm install
npm run dev   # http://localhost:5173 (proxying directly to http://localhost:8080)
npm run build # production build (served by nginx in Docker)
```

SPA routes:

- `/` employee table with actions
- `/add` create form
- `/edit/:id` edit form
- `/view/:id` read-only detail card

The Axios wrapper defaults to `http://localhost:8080/api/employees`; override with `VITE_API_BASE_URL`.

## Docker workflows

Build and run the full stack with one command:

```bash
docker-compose up --build
```

Exposed ports:

- MySQL `3306`
- Backend `8080`
- Frontend `5173` (nginx serving the built SPA)

The backend waits for the MySQL health check before booting, and Hibernate auto-creates tables with `spring.jpa.hibernate.ddl-auto=update`.

## Tests & quality

- **Service unit tests** (`EmployeeServiceImplTest`) mock the repository to cover create logic and not-found cases.
- **Controller integration test** (`EmployeeControllerIntegrationTest`) boots the full Spring context with H2 and exercises create + fetch operations.
- Run all backend tests via `./mvnw test`.
- Frontend was verified manually (npm dev server) – create, update, view, delete flows.

## Next steps

- Configure CI to execute `./mvnw test` and `npm run build`.
- Secure credentials for production via secrets or Vault.

