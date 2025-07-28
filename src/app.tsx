import "./app.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Router root={Layout}>
      <FileRoutes />
    </Router>
  );
}
