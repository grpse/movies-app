import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthedUserModel } from './models/authed-user.model';
import { Request } from 'express';

const jwtExtractor = (req: Request) => {
  if (req && req.cookies && req.cookies[jwtConstants.jwtTokenCookieName]) {
    const jwt = req.cookies[jwtConstants.jwtTokenCookieName] as string;
    return jwt;
  }

  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (token) {
    return token;
  }

  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: AuthedUserModel): AuthedUserModel {
    return {
      id: payload.id,
      username: payload.username,
      createdAt: payload.createdAt,
    };
  }
}
