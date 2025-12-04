DC := docker compose -f docker-compose.yml

.PHONY: help chmod-entrypoint build up up-detach down down-volumes logs shell

help:
	@echo "Simple Docker helper for development"
	@echo "Targets: chmod-entrypoint, build, up, up-detach, down, down-volumes, logs, shell"

chmod-entrypoint:
	@echo "Make entrypoint executable"
	-chmod +x entrypoints/entrypoint.sh || true

build:
	@echo "Build images"
	$(DC) build --no-cache

up:
	@echo "Start (foreground)"
	$(DC) up --build --remove-orphans

up-detach:
	@echo "Start (detached)"
	$(DC) up -d --build

down:
	@echo "Stop and remove containers"
	$(DC) down

down-volumes:
	@echo "Stop and remove containers and volumes"
	$(DC) down -v

logs:
	@echo "Tail logs"
	$(DC) logs -f

shell:
	@echo "Open a shell in the frontend service"
	$(DC) run --rm --entrypoint sh frontend
