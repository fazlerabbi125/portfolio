"use client";

import { Home, Menu, Share2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAVIGATION_LINKS } from "@/lib/constants";
import "./AppHeader.css";

const navLinkValues = Object.values(NAVIGATION_LINKS);

export default function AppHeader() {
	const pathname = usePathname();
	const [shareUrl, setShareUrl] = useState("");

	return (
		<header className="app-header">
			<div className="app-header__inner">
				<Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
					<Home size={22} />
				</Link>
				<div className="app-header__actions">
					<Dialog
						onOpenChange={(open) =>
							open &&
							setShareUrl(
								process.env.NEXT_PUBLIC_APP_URL ||
									new URL("/", window.location.href).toString(),
							)
						}
					>
						<DialogTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									aria-label="Share portfolio"
								/>
							}
						>
							<Share2 size={18} />
						</DialogTrigger>
						<DialogContent showCloseButton>
							<DialogHeader>
								<DialogTitle>Share this portfolio</DialogTitle>
								<DialogDescription>
									Choose where you would like to share it.
								</DialogDescription>
							</DialogHeader>
							<div className="flex justify-center gap-4 mt-4">
								<WhatsappShareButton
									url={shareUrl}
									title="Fazle Rabbi Faiyaz — Portfolio"
									aria-label="Share on WhatsApp"
								>
									<WhatsappIcon size={48} round />
								</WhatsappShareButton>
								<LinkedinShareButton
									url={shareUrl}
									title="Fazle Rabbi Faiyaz — Portfolio"
									aria-label="Share on LinkedIn"
								>
									<LinkedinIcon size={48} round />
								</LinkedinShareButton>
								<FacebookShareButton
									url={shareUrl}
									aria-label="Share on Facebook"
								>
									<FacebookIcon size={48} round />
								</FacebookShareButton>
							</div>
							<DialogFooter>
								<DialogClose
									render={
										<Button className="bg-foreground text-surface">
											Close
										</Button>
									}
								>
									Close
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					{pathname !== "/" && (
						<DropdownMenu>
							<DropdownMenuTrigger
								className="nav-dropdown__trigger"
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
								{navLinkValues
									.filter(({ route }) => !route.startsWith("/gallery/"))
									.slice(0, 3)
									.map(({ label, route }) => (
										<DropdownMenuItem
											key={route}
											render={
												<Link
													href={route}
													aria-current={pathname === route ? "page" : undefined}
													className={
														pathname === route
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
										{navLinkValues
											.filter(({ route }) => route.startsWith("/gallery/"))
											.map(({ label, route }) => (
												<DropdownMenuItem
													key={route}
													render={
														<Link
															href={route}
															aria-current={
																pathname === route ? "page" : undefined
															}
															className={
																pathname === route
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
								{navLinkValues
									.filter(({ route }) => !route.startsWith("/gallery/"))
									.slice(3)
									.map(({ label, route }) => (
										<DropdownMenuItem
											key={route}
											render={
												<Link
													href={route}
													aria-current={pathname === route ? "page" : undefined}
													className={
														pathname === route
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
					{/* <button className="icon-button" aria-label="Toggle colour theme">Theme toggle</button> */}
				</div>
			</div>
		</header>
	);
}
