import type { StorybookConfig } from "@storybook/svelte-vite";
import type { Indexer } from '@storybook/types';

const urlIndexer: Indexer = {
	test: /\.url\.js$/,
	createIndex: async (fileName, { makeTitle }) => {
		const fileData = await import(fileName);

		return Object.entries(fileData)
			.filter(([key]) => key != 'default')
			.map(([name, url]) => {
				return {
					type: 'docs',
					importPath: fileName,
					exportName: name,
					title: makeTitle(name)
						.replace(/([a-z])([A-Z])/g, '$1 $2')
						.trim(),
					__id: `url--${name}--${encodeURIComponent(url as string)}`,
					tags: ['!autodocs', 'url']
				};
			});
	}
};

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|ts|svelte)", "../src/**/*.url.js"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-svelte-csf",
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
	experimental_indexers: async (existingIndexers) => [urlIndexer, ...existingIndexers]
};
export default config;
