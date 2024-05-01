import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "")
	return {
		plugins: [ react() ],
		base: env._BASE,
		css: {
			postcss: {
				plugins: [ tailwindcss() ],
			}
		},
		envPrefix: "_"
	}
})
