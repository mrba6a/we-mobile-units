/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module Federation declarations
declare module 'we_review/ReviewRoutes' {
  export const ReviewRoutes: React.ComponentType<any>;
  export default React.ComponentType<any>;
}

declare module 'we_emp/EmpRoutes' {
  export const EmpRoutes: React.ComponentType<any>;
  export default React.ComponentType<any>;
}

declare module 'we_inv/InvRoutes' {
  export const InvRoutes: React.ComponentType<any>;
  export default React.ComponentType<any>;
}