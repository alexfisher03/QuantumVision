import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	base: './',
	plugins: [sveltekit()],

	ssr: {
		noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts'] : []
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
