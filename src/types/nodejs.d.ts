/*----------------------------------------------*
 *                                               *
 *               GLOBAL INTERFACES               *
 *                                               *
 *-----------------------------------------------*/
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    FACEBOOK_CLIENT_ID: string;
    FACEBOOK_CLIENT_SECRET: string;
  }
}
