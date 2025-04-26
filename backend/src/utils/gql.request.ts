import { Request } from 'express';

export interface GqlRequest extends Request {
  cookies: { [key: string]: string };
}
