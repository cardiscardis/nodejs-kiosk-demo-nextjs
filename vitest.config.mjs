import { loadEnvConfig } from '@next/env';

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import ViteYaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), ViteYaml()],
  test: {
    include: ['./__tests__/functional/**/**/*.{ts,tsx}'],
    environment: 'jsdom',
  },
});
