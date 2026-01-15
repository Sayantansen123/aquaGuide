import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import 'leaflet/dist/leaflet.css'
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import store from "./store/store.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
	<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
		<App />
	</ThemeProvider>
  </Provider>
);
