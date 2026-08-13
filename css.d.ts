// Next.js only ships type declarations for CSS Modules (`*.module.css`), not for
// plain global stylesheets. TypeScript 6+ flags an undeclared side-effect import
// (`import "./globals.css"`) with TS2882, so declare the module here.
// `*.module.css` is a more specific pattern, so Next's CSS Module types still win.
declare module '*.css';
