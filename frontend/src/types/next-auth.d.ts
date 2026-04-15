import 'next-auth';

declare module 'next-auth' {
  interface Session {
    access_token?: string;
    id_token?: string;
    djangoAccess?: string;
    djangoRefresh?: string;
  }
  interface Account {
    djangoAccess?: string;
    djangoRefresh?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    id_token?: string;
    djangoAccess?: string;
    djangoRefresh?: string;
  }
}