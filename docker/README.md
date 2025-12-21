# Sea Venture Docker Development Setup

This Docker setup provides a complete development environment for the Sea Venture application with proper networking between frontend and backend services.

## Architecture

- **Frontend**: React/Vite application running on port 3000
- **Backend**: Node.js API server running on port 5000
- **Network**: Custom Docker network `sea-venture-network` for inter-service communication

## Prerequisites

- Docker and Docker Compose installed
- Backend code in `../../backend` directory (relative to this docker folder)

## Quick Start

1. **Make entrypoint executable:**
   ```bash
   make chmod-entrypoint
   ```

2. **Build and start all services:**
   ```bash
   make up-detach
   ```

3. **Check logs:**
   ```bash
   make logs
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Available Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make build` | Build all Docker images |
| `make up` | Start services in foreground |
| `make up-detach` | Start services in background |
| `make down` | Stop and remove containers |
| `make logs` | View logs from all services |
| `make frontend-logs` | View only frontend logs |
| `make backend-logs` | View only backend logs |
| `make frontend-shell` | Open shell in frontend container |
| `make backend-shell` | Open shell in backend container |

## Networking

Services communicate through a custom Docker network:
- Frontend can reach backend at `http://backend:5000`
- External access through published ports (3000 for frontend, 5000 for backend)

## Environment Variables

### Frontend (.env.dev)
- `VITE_PORT=3000`
- `VITE_API_BASE_URL='http://backend:5000/api'`

### Backend
- `NODE_ENV=development`
- `PORT=5000`

## Development Workflow

1. **Start the stack:**
   ```bash
   make up-detach
   ```

2. **Make code changes** - Files are volume-mounted, so changes are reflected immediately

3. **Check logs if needed:**
   ```bash
   make frontend-logs
   # or
   make backend-logs
   ```

4. **Access containers for debugging:**
   ```bash
   make frontend-shell
   make backend-shell
   ```

5. **Stop when done:**
   ```bash
   make down
   ```

## Troubleshooting

- **Port conflicts:** Ensure ports 3000 and 5000 are available
- **Backend path:** Update the backend context path in `docker-compose.yml` if your backend is in a different location
- **Network issues:** Run `make network-prune` to clean up old networks
- **Volume issues:** Use `make down-volumes` to reset volumes

## File Structure

```
docker/
├── docker-compose.yml    # Multi-service configuration
├── Makefile             # Development commands
├── entrypoints/
│   └── entrypoint.sh    # Entrypoint script
├── envs/
│   └── .env.dev         # Frontend environment variables
└── files/
    ├── dev.dockerfile       # Frontend Dockerfile
    └── backend.dockerfile   # Backend Dockerfile
```