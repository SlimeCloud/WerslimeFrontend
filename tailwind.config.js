import { nextui } from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			colors: {
				primary: "#66B25B",
				danger: "#ff0202"
			},
			keyframes: {
				borderPulse: {
					"0%": {
						"outline": "2px solid rgba(102, 178, 91, 0.1)",
						"box-shadow": "0 0 0 0 rgba(102, 178, 91, 0.6)"
					},
					"50%": {
						"outline": "2px solid rgba(102, 178, 91, 0.6)",
						"box-shadow": "0 0 0 20px rgba(102, 178, 91, 0)"
					},
					"100%": {
						"outline": "2px solid rgba(102, 178, 91, 0)",
						"box-shadow": "0 0 0 0 rgba(102, 178, 91, 0)"
					}
				}
			},
			animation: {
				"border-pulse": "borderPulse 2s infinite"
			},
			screens: {
				"h-md": { "raw": "(height >= 650px)" },
				"h-lg": { "raw": "(height >= 800px)" }
			}
		}
	},
	darkMode: "class",
	plugins: [
		nextui({
			addCommonColors: true,
			themes: {
				dark: {
					colors: {
						background: "#0c0c0c"
					}
				}
			}
		})
	]
}
