import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

function StorybookUrlLinksPlugin(): Plugin {
  return {
    name: 'storybook-url-links',
    async transform(code: string, id: string) {
      if (id.endsWith('.url.js')) {
        const ast = acorn.parse(code, {
          ecmaVersion: 2020,
          sourceType: 'module',
        });

        const namedExports: string[] = [];
        let defaultExport = 'export default {};';

        walk.simple(ast, {
          // Extract named exports, those represent our stories, and for each of
          // them, we'll return a valid Svelte component.
          ExportNamedDeclaration(node: acorn.ExportNamedDeclaration) {
            if (
              node.declaration &&
              node.declaration.type === 'VariableDeclaration'
            ) {
              node.declaration.declarations.forEach((declaration) => {
                if ('name' in declaration.id) {
                  namedExports.push(declaration.id.name);
                }
              });
            }
          },
          // Preserve our default export.
          ExportDefaultDeclaration(node: acorn.ExportDefaultDeclaration) {
            defaultExport = code.slice(node.start, node.end);
          },
        });

        return {
          code: `
            import RedirectBack from '../.storybook/RedirectBack.svelte';
            ${namedExports
              .map(
                (name) =>
                  `export const ${name} = () => new RedirectBack({ target: 'storybook-root'});`
              )
              .join('\n')}
            ${defaultExport}
          `,
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
