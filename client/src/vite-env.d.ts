/// <reference types="vite/client" />

interface ImportMetaEnv{
     VITE_SANITY_TOKEN: string;
      VITE_SANITY_PROJECT_ID: string;
}
interface ImportMeta{
    readonly env:ImportMetaEnv
}
