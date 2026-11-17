"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeSwitcher";

export default function ThemeToggle() {
	const { darkMode, darkModeActivation } = useTheme();
	const label = darkMode ? "Switch to light theme" : "Switch to dark theme";

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={() => darkModeActivation(!darkMode)}
			title={label}
			aria-label={label}
			aria-pressed={darkMode}
		>
			{darkMode ? (
				<Sun aria-hidden="true" size={18} />
			) : (
				<Moon aria-hidden="true" size={18} />
			)}
		</button>
	);
}
