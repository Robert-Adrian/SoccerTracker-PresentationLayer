=================RUNNING DOCKER-COMPOSE FILE - INSTRUCTIONS==================
- When running for the first time:

1. Go to docker-compose folder
2. Run "docker-compose up"
3. (After all containers started) Restart Springboot using "docker restart <<CONTAINER_ID>>" (because spring starts before flyway applying all migrations, we need to restart after flyway applied all migrations)

- When running:

1. Go to docker-compose folder
2. Run "docker-compose up"

=============================================================================