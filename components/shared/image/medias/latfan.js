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
};
