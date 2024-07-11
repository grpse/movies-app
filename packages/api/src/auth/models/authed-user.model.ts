import { User } from '@prisma/client';

export type AuthedUserModel = Omit<User, 'password'>;
