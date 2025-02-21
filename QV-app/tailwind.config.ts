import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			screens: {
				'xxl': '1400px', // Custom breakpoint for 1400px width
			},
			keyframes: {
				gradient: {
					"0%": {backgroundPosition: "0% 50%"},
					"100%": {backgroundPosition: "100% 50%"}
				},
			},
			animation: {
				gradient: "gradient 6s linear infinite",
			},
		},
	},

	plugins: [typography, forms, flowbitePlugin]

} satisfies Config;
