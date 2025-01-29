import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			screens: {
				'xxl': '1400px', // Custom breakpoint for 1400px width
			},
		},
	},

	plugins: [typography, forms]
} satisfies Config;
