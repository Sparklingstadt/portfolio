// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages as a project site:
// https://sparklingstadt.github.io/portfolio/
export default defineConfig({
  site: 'https://sparklingstadt.github.io',
  base: '/portfolio',
  // Pages live at folder URLs, so the mocks' relative style.css / script.js resolve.
  trailingSlash: 'always',
  build: { format: 'directory' },
});
