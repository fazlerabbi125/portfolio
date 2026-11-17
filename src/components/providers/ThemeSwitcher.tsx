"use client";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

const themeCookieName = "app-theme";

export const ThemeContext = createContext<null | {
	darkMode: boolean;
	darkModeActivation: (darkMode: boolean) => void;
}>(null);

export default function ThemeSwitcher({
	children,
	inDarkMode = false,
}: Readonly<PropsWithChildren<{ inDarkMode?: boolean }>>) {
	const [darkMode, setDarkMode] = useState(inDarkMode);

	const darkModeActivation = useCallback((newTheme: boolean) => {
		if (newTheme) {
			document.documentElement.dataset.appTheme = "dark";
		} else {
			delete document.documentElement.dataset.appTheme;
		}
		// biome-ignore lint/suspicious/noDocumentCookie: The next server render needs this preference.
		document.cookie = `${themeCookieName}=${newTheme ? "dark" : "light"}; Path=/; Max-Age=31536000; SameSite=Lax`;
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
