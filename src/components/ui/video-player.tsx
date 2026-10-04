import { useMemo } from "react";
import "@videojs/react/video/minimal-skin.css";
import { YouTubeVideo } from "@videojs/react/media/youtube-video";
import { MinimalVideoSkin, VideoPlayer as Player } from "@videojs/react/video";

interface VideoPlayerProps
	extends Omit<React.ComponentProps<typeof MinimalVideoSkin>, "children"> {
	playerSettings: Omit<
		React.ComponentProps<typeof YouTubeVideo>,
		"children" | "ref"
	>;
}

export default function VideoPlayer({
	playerSettings,
	...rest
}: Readonly<VideoPlayerProps>) {
	const memoizedPlayerSettings = useMemo(
		() => playerSettings,
		[playerSettings],
	);
	return (
		<Player>
			<MinimalVideoSkin {...rest}>
				<YouTubeVideo {...memoizedPlayerSettings} />
			</MinimalVideoSkin>
		</Player>
	);
}
