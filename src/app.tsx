import "./app.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import Layout from "./components/Layout";

// biome-ignore lint/style/noDefaultExport: routes files should be exported by default
export default function App() {
	return (
		<Router root={Layout}>
			<FileRoutes />
		</Router>
	);
}
