export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface GoogleUser {
  google_id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}
