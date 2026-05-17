import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    plugin: 'src/plugin.ts',
    cli: 'src/cli.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
  target: 'node18',
  external: ['vite'],
  // CLI must keep its shebang on the JS file
  esbuildOptions(options, { format }) {
    if (format === 'esm') {
      options.banner = { js: '' };
    }
  },
});
