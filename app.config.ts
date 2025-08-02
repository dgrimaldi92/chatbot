import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

// biome-ignore lint/style/noDefaultExport: routes files should be exported by default
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
});
