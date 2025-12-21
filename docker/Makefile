DC := docker compose -f docker-compose.yml

.PHONY: help chmod-entrypoint build up up-detach down down-volumes logs shell frontend-logs backend-logs frontend-shell backend-shell network-prune

help:
	@echo "Docker helper for Sea Venture development stack"
	@echo "Targets:"
	@echo "  chmod-entrypoint  - Make entrypoint executable"
	@echo "  build             - Build all images"
	@echo "  up                - Start all services (foreground)"
	@echo "  up-detach         - Start all services (detached)"
	@echo "  down              - Stop and remove containers"
	@echo "  down-volumes      - Stop and remove containers + volumes"
	@echo "  logs              - Tail logs from all services"
	@echo "  frontend-logs     - Tail frontend logs only"
	@echo "  backend-logs      - Tail backend logs only"
	@echo "  frontend-shell    - Open shell in frontend container"
	@echo "  backend-shell     - Open shell in backend container"
	@echo "  network-prune     - Clean up unused networks"

chmod-entrypoint:
	@echo "Make entrypoint executable"
	-chmod +x entrypoints/entrypoint.sh || true

build:
	@echo "Build all images"
	$(DC) build --no-cache

up:
	@echo "Start all services (foreground)"
	$(DC) up --build --remove-orphans

up-detach:
	@echo "Start all services (detached)"
	$(DC) up -d --build --remove-orphans

down:
	@echo "Stop and remove containers"
	$(DC) down

down-volumes:
	@echo "Stop and remove containers + volumes"
	$(DC) down -v

logs:
	@echo "Tail logs from all services"
	$(DC) logs -f

frontend-logs:
	@echo "Tail frontend logs"
	$(DC) logs -f frontend

backend-logs:
	@echo "Tail backend logs"
	$(DC) logs -f backend

frontend-shell:
	@echo "Open a shell in the frontend service"
	$(DC) exec frontend sh

backend-shell:
	@echo "Open a shell in the backend service"
	$(DC) exec backend sh

network-prune:
	@echo "Clean up unused networks"
	docker network prune -f
