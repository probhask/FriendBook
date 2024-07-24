declare global {
  namespace NodeJS {
      interface ImportMeta {
        env:{
      VITE_SANITY_TOKEN: string;
      VITE_SANITY_PROJECT_ID: string;
    }
    }
  }
}
export {}