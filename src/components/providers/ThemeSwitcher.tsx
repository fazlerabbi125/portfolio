"use client";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const darkModeKey = "isDark";

export const ThemeContext = createContext<null | {
	darkMode: boolean;
	darkModeActivation: (darkMode: boolean) => void;
}>(null);

export default function ThemeSwitcher({
	children,
}: Readonly<PropsWithChildren>) {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setDarkMode(document.documentElement.dataset.appTheme === "dark");
	}, []);

	const darkModeActivation = useCallback((newTheme: boolean) => {
		document.documentElement.dataset.appTheme = newTheme ? "dark" : "";
		localStorage.setItem(darkModeKey, String(newTheme));
		setDarkMode(newTheme);
	}, []);

	const value = useMemo(
		() => ({ darkMode, darkModeActivation }),
		[darkMode, darkModeActivation],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeSwitcher");
	}
	return context;
}
