import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: 'cjs',
    splitting: true,
    treeshake: true,
    sourcemap: false,
    clean: true,
    minify: false,
    esbuildPlugins: [],
});
