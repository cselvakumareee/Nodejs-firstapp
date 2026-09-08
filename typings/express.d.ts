declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    user?: {
      _id: string;
      email: string;
    };
  }
}

export {};
