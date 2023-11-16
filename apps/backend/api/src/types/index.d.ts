import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    cookie: Cookie;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session;
  }
}
declare global {
  namespace Express {
    interface Request {
      flash: (message: string) => void;
    }
  }
}
