echo "DATABASE_URL=postgresql://postgres:password@localhost:5555/movie_manager_db
JWT_SECRET=aoiwdjoqiwjdoiqwjdoiqwjdojqw" > packages/api/.env

cd packages/api && npm install && npx prisma migrate dev && cd -
cd packages/frontend && npm install && cd -