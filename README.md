# Resize Photos
Resize Photos Challenge for B2W - SkyHub

## Requirements
- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## How to execute

Run the docker compose script:
```bash
docker-compose up -d
```

Import the photos
```bash
docker-compose exec web npm run import
```

Access the URL http://localhost:3000/photos to see the photos