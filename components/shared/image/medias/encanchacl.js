/**
 * if media is not defined, uses void key. Values of media can be:
 * the object is based by key and value
 * the key is the media query
 * the value is the width of the image
 * eg: { 1200: 400 }
 * for a different aspectRatio we can use an object
 * eg: { 1200: { width: 670, aspectRatio: 4/3 }}
 */

export default {
	"": {
		768: 1200,
		450: 768,
		0: 450,
	},
	"result-list": {
		0: 125,
		992: 500,
		1500: 350,
	},
	"regular-chain-story-card": {
		0: 728,
		768: 298,
		992: 335,
	},
	"prime-feed-main": {
		0: {
			width: 460,
			aspectRatio: "11 / 14",
		},
		500: {
			width: 728,
			aspectRatio: "56 / 37",
		},
	},
	"prime-feed-opinion": {
		0: 122,
	},
	"prime-feed-bottom": {
		0: 120,
	},
	"article-body": {
		0: 500,
		500: 800,
	},
	"video-list__main": {
		0: {
			width: 460,
			aspectRatio: "354 / 484",
		},
		500: {
			width: 730,
			aspectRatio: "691 / 484",
		},
	},
	"video-list__column": {
		0: 125,
	},
	"most-read": {
		0: 106,
	},
	"recirculation": {
		0: 460,
		500: 730,
		1086: 250,
	},
	"main-chain-story-card": {
		0: {
			width: 106,
			aspectRatio: "1 / 1",
		},
		992: {
			width: 158,
			aspectRatio: "5 / 4",
		},
	},
	"main-chain-main-story-card": {
		0: 500,
		500: 768,
		768: 690,
	},
	"read-also": {
		0: {
			width: 112,
			aspectRatio: "1 / 1",
		},
		768: {
			width: 232,
			aspectRatio: "232 / 154",
		},
	},
	"article-amp": {
		0: 1200,
	},
	"feed-podcast": {
		0: 180,
		768: 260,
	},
	"result-list-podcast": {
		0: 150,
	},
	"section-hero-header-background-mobile": {
		0: 354,
	},
	"section-hero-header-background": {
		0: 1046,
	},
	"section-hero-header-logo": {
		0: 100,
		768: 250,
	},
	"podcast-collection": {
		0: 180,
		450: 340,
		768: 240,
	},
	"video-featured-feed__main": {
		0: {
			width: 450,
			aspectRatio: "394 / 484",
		},
		500: {
			width: 760,
			aspectRatio: "16 / 9",
		},
		768: {
			width: 1080,
			aspectRatio: "16 / 9",
		},
	},
	"video-featured-feed__list": {
		0: {
			width: 120,
			aspectRatio: "1 / 1",
		},
		768: {
			width: 160,
			aspectRatio: "158 / 128",
		},
	},
	"video-feed__list": {
		0: {
			width: 120,
			aspectRatio: "1 / 1",
		},
		768: {
			width: 160,
			aspectRatio: "158 / 128",
		},
	},
};
