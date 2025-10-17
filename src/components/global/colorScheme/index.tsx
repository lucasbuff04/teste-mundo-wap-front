import { useEffect } from "react";
import { MoonSvg } from "../svgs/moon";
import { SunSvg } from "../svgs/sun";
import { ModeToggle } from "./styles";

export const ColorScheme = () => {
	let colorScheme = localStorage.getItem("theme") || "dark";

	const setColorTheme = () => {
		const moon = document.getElementById("moon");
		const sun = document.getElementById("sun");

		localStorage.setItem("theme", colorScheme);
		moon?.setAttribute("data-visible", (colorScheme === "light").toString());
		sun?.setAttribute("data-visible", (colorScheme === "dark").toString());
		document.documentElement.style.setProperty("color-scheme", colorScheme);
	};

	const changeColorTheme = () => {
		if (colorScheme === "dark") {
			colorScheme = "light";
		} else {
			colorScheme = "dark";
		}
		setColorTheme();
	};

	useEffect(() => {
		setColorTheme();
	});

	return (
		<>
			<ModeToggle type="button" id="mode-toggle" onClick={changeColorTheme}>
				<span id="sun" data-active="false">
					<SunSvg />
				</span>

				<span id="moon" data-active="true">
					<MoonSvg />
				</span>
			</ModeToggle>
		</>
	);
};
