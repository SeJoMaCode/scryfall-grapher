/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// CSS module declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
