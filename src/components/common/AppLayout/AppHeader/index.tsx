"use client";

import { Heart, Home, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NAVIGATION_LINKS, USER_ROLES } from "@/lib/constants";
import type { SessionData } from "@/lib/session";
import "./AppHeader.css";

const navLinkValues = Object.values(NAVIGATION_LINKS);
const pageLinks = navLinkValues.filter(
	({ route }) => !route.startsWith("/gallery/"),
);
const galleryLinks = navLinkValues.filter(({ route }) =>
	route.startsWith("/gallery/"),
);

function isActivePath(pathname: string, route: string) {
	return pathname === route;
}

interface AppHeaderProps {
	currentUser: SessionData | null;
}

export default function AppHeader({ currentUser }: Readonly<AppHeaderProps>) {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const isGalleryActive = pathname.startsWith("/gallery/");

	return (
		<header className="app-header">
			<div className="app-header__inner">
				<Link href="/" aria-current={isHome ? "page" : undefined}>
					<Home size={22} />
				</Link>

				{!isHome && (
					<nav className="app-header__nav" aria-label="Primary">
						<NavigationMenu>
							<NavigationMenuList>
								{pageLinks.slice(0, 3).map(({ label, route }) => (
									<NavigationMenuItem key={route}>
										<NavigationMenuLink
											active={isActivePath(pathname, route)}
											render={
												<Link
													href={route}
													className={
														isActivePath(pathname, route) ? "active" : undefined
													}
													aria-current={
														isActivePath(pathname, route) ? "page" : undefined
													}
												/>
											}
											className={navigationMenuTriggerStyle()}
										>
											{label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
								<NavigationMenuItem>
									<NavigationMenuTrigger
										className={isGalleryActive ? "bg-muted/50" : undefined}
									>
										Gallery
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid min-w-44 gap-1">
											{galleryLinks.map(({ label, route }) => (
												<li key={route}>
													<NavigationMenuLink
														active={isActivePath(pathname, route)}
														render={
															<Link
																href={route}
																className={
																	isActivePath(pathname, route)
																		? "text-tertiary pointer-events-none"
																		: undefined
																}
																aria-current={
																	isActivePath(pathname, route)
																		? "page"
																		: undefined
																}
															/>
														}
													>
														{label}
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
								{pageLinks.slice(3).map(({ label, route }) => (
									<NavigationMenuItem key={route}>
										<NavigationMenuLink
											active={isActivePath(pathname, route)}
											render={
												<Link
													href={route}
													className={
														isActivePath(pathname, route) ? "active" : undefined
													}
													aria-current={
														isActivePath(pathname, route) ? "page" : undefined
													}
												/>
											}
											className={navigationMenuTriggerStyle()}
										>
											{label}
										</NavigationMenuLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
				)}

				<div className="app-header__actions">
					{!isHome && (
						<DropdownMenu>
							<DropdownMenuTrigger
								className="nav-dropdown__trigger app-header__menu-toggle"
								aria-label="Open page navigation"
							>
								<Menu aria-hidden="true" className="nav-dropdown__icon" />
								<X aria-hidden="true" className="nav-dropdown__icon" />
								<span className="sr-only">Pages</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="nav-dropdown__content"
							>
								{pageLinks.slice(0, 3).map(({ label, route }) => (
									<DropdownMenuItem
										key={route}
										render={
											<Link
												href={route}
												aria-current={
													isActivePath(pathname, route) ? "page" : undefined
												}
												className={
													isActivePath(pathname, route)
														? "nav-dropdown__item--active"
														: undefined
												}
											/>
										}
									>
										{label}
									</DropdownMenuItem>
								))}
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Gallery</DropdownMenuSubTrigger>
									<DropdownMenuSubContent className="nav-dropdown__content">
										{galleryLinks.map(({ label, route }) => (
											<DropdownMenuItem
												key={route}
												render={
													<Link
														href={route}
														aria-current={
															isActivePath(pathname, route) ? "page" : undefined
														}
														className={
															isActivePath(pathname, route)
																? "nav-dropdown__item--active"
																: undefined
														}
													/>
												}
											>
												{label}
											</DropdownMenuItem>
										))}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
								{pageLinks.slice(3).map(({ label, route }) => (
									<DropdownMenuItem
										key={route}
										render={
											<Link
												href={route}
												aria-current={
													isActivePath(pathname, route) ? "page" : undefined
												}
												className={
													isActivePath(pathname, route)
														? "nav-dropdown__item--active"
														: undefined
												}
											/>
										}
									>
										{label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{currentUser && (
						<DropdownMenu>
							<DropdownMenuTrigger
								className="user-avatar"
								aria-label={`Account menu for ${currentUser.name}`}
							>
								<UserIcon size={22} />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="nav-dropdown__content"
							>
								{currentUser.role === USER_ROLES.USER && (
									<DropdownMenuItem
										render={
											<Link
												href="/blog/favorites"
												aria-current={
													pathname === "/blog/favorites" ? "page" : undefined
												}
											/>
										}
									>
										<Heart size={15} />
										Favorites
									</DropdownMenuItem>
								)}
								{currentUser.role === USER_ROLES.USER && (
									<DropdownMenuSeparator />
								)}
								<form action={logout} id="header-logout" />
								<DropdownMenuItem
									variant="destructive"
									render={
										<button
											type="submit"
											form="header-logout"
											className="w-full text-left font-normal"
										/>
									}
									nativeButton
								>
									<LogOut size={15} />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</header>
	);
}
