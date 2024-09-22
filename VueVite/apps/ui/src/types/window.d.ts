export {}; // This ensures the file is treated as a module

declare global {
  interface Window {
    _env_: {
      clientId: string;
      tenantId: string;
      scopes: string[];
    };
  }
}
