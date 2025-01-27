import { User as SchemaUser } from '@prisma/client';

type User = Omit<SchemaUser, 'password'>;

declare module 'express' {
  interface Request {
    // Add the user property to the Request object
    user?: User;
  }
}
