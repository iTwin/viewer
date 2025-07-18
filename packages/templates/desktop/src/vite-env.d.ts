/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly IMJS_VIEWER_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}