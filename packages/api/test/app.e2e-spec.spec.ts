import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomString } from './utils/randomString';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let signupUser: { username: string; password: string };
  let lastAccessToken: string;

  const runSignup = async () => {
    await request(app.getHttpServer())
      .post('/signup')
      .send(signupUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.username).toBe(signupUser.username);
      });
  };

  const runLogin = async () => {
    await request(app.getHttpServer())
      .post('/login')
      .send(signupUser)
      .expect(201)
      .expect((res) => {
        expect(res.body.accessToken).toBeDefined();
        lastAccessToken = res.body.accessToken;
      });
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    signupUser = {
      username: randomString(),
      password: randomString(),
    };
  });

  describe('Auth', () => {
    it('/signup (POST)', () => {
      return runSignup();
    });

    it('/login (POST)', async () => {
      await runSignup();
      await runLogin();
    });
  });

  describe('movies', () => {
    const runCreateMovie = async () => {
      let movieId: string;
      const movieData = {
        title: randomString(),
        description: randomString(),
      };
      await request(app.getHttpServer())
        .post('/movies')
        .send(movieData)
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(201)
        .expect((res) => {
          movieId = res.body.id;
          expect(res.body.title).toBeDefined();
        });

      return { movieId, ...movieData };
    };

    it('/movies (POST)', async () => {
      await runSignup();
      await runLogin();
      await runCreateMovie();
    });

    it('/movies (GET)', async () => {
      await runSignup();
      await runLogin();
      const { movieId } = await runCreateMovie();
      await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(movieId);
        });
    });

    it('/movies/:id (PATCH)', async () => {
      await runSignup();
      await runLogin();
      const { movieId, title: originalTitle } = await runCreateMovie();

      await request(app.getHttpServer())
        .patch(`/movies/${movieId}`)
        .send({
          title: randomString(),
          description: randomString(),
        })
        .set('Authorization', `Bearer ${lastAccessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBeDefined();
          expect(res.body.title).not.toEqual(originalTitle);
        });
    });
  });
});
