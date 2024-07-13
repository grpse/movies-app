# Installation

## Prerequisites

- Node.js >= 18
- Docker

## Steps

1. Clone the repository
2. Navigate to the root directory
3. Run `docker-compose up -d` for infra
4. `sh configure-dev-env.sh`
5. `cd packages/api && npm run start:dev`
6. `cd packages/frontend && npm run dev`
