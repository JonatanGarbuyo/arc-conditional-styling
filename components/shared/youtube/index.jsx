import React from "react";
import PropTypes from "prop-types";
// https://developers.google.com/youtube/iframe_api_reference?hl=es

const YoutubeVideo = ({ customTitle, videoId, autoPlayActive, ...props }) => {
	const allowedOptionsString = [
		"accelerometer",
		"autoplay",
		"clipboard-write",
		"encrypted-media",
		"gyroscope",
		"picture-in-picture",
		"web-share",
	].join("; ");

	return (
		<iframe
			id={`youtube_video_${videoId}`}
			width="100%"
			height="100%"
			frameBorder="0"
			allow={allowedOptionsString}
			allowFullScreen
			src={`https://www.youtube.com/embed/${videoId}${autoPlayActive ? "?autoplay=1&mute=1" : ""}`}
			title={customTitle || "YouTube video player"}
			{...props}
		></iframe>
	);
};

YoutubeVideo.propTypes = {
	videoId: PropTypes.string,
	customTitle: PropTypes.string,
	autoPlayActive: PropTypes.bool,
};

export default YoutubeVideo;
