export interface JwtPayload {
  sub: string;
  userId?: number;
  id?: number;
  email?: string;
  name?: string;
  role?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: any;
}
