import React from "react";
import { HomePage } from "../components/home";
import { VisitationProvider } from "../context/visitations";

export default function App() {
	return (
		<React.StrictMode>
			<VisitationProvider>
				<HomePage />
			</VisitationProvider>
		</React.StrictMode>
	);
}
