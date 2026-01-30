import extractResizableID from "./extract-resizable-id";

/**
 * Class to contain a story data and override its values.
 */
export class CreateStory {
	/**
	 * Create a StoryOverrideValues instance.
	 * @param {Object} ansObject - The initial object containing story data.
	 */
	constructor(ansObject) {
		Object.assign(this, ansObject);
		this.customValues = {};
	}

	get byline() {
		const bylineList = this.credits?.by;

		return (
			this.customValues.byline ||
			(bylineList && {
				...this.credits?.by[0],
			}) ||
			{}
		);
	}

	get date() {
		return this.customValues.date || this.display_date || "";
	}

	/**
	 * Get the deck (description).
	 * @return {string} The description string.
	 */
	get deck() {
		// it's easier if it doesn't have the same name
		return (
			this.customValues.description || this.subheadlines?.basic || this.description?.basic || ""
		);
	}

	get headline() {
		return this.customValues.headline || this.headlines?.basic || "";
	}

	get linkUrl() {
		const website = this.arcSite;
		return (
			this.customValues.linkUrl ||
			(website && this.websites?.[website]?.website_url) ||
			// for most read stories
			this.website_url ||
			""
		);
	}

	get promoItem() {
		const auth = this.customValues.resizedAuth;
		const url = this.customValues.imageUrl;
		const customPromoItem = {
			_id: extractResizableID(url),
			auth,
			url,
		};
		return auth && url
			? customPromoItem
			: this.promo_items?.basic ||
					this.promo_items?.gallery?.promo_items?.basic ||
					this.promoItemLeadArt ||
					{};
	}

	get promoItemLeadArt() {
		if (this.promo_items?.lead_art?.type === "gallery")
			return this.promo_items?.lead_art?.promo_items?.basic || {};
		return this.promo_items?.lead_art || {};
	}

	get overline() {
		return this.customValues.overline || this.taxonomy?.primary_section?.name || "";
	}

	get overlineUrl() {
		return this.customValues.overlineUrl || this.taxonomy?.primary_section?.path || ""; // || this.canonical_url;
	}
	get firstTag() {
		return this.taxonomy?.tags?.[0]?.text || "";
	}

	get relatedContent() {
		return this.customValues.relatedContent || this.related_content?.basic || "";
	}

	/**
	 * Set a custon byline name.
	 * @param {string} name - The byline name.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setBylineName(name) {
		if (name) this.customValues.byline = { name: name };
		return this;
	}

	/**
	 * Set a custom date.
	 * @param {string} date - The date string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setDate(date) {
		if (date) this.customValues.date = date;
		return this;
	}

	/**
	 * Set a custom description.
	 * @param {string} description - The description string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setDescription(description) {
		if (description) this.customValues.description = description;
		return this;
	}

	/**
	 * Set a custom headline.
	 * @param {string} headlineText - The headline string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setHeadline(headlineText) {
		if (headlineText) this.customValues.headline = headlineText;
		return this;
	}

	/**
	 * Set a custon image URL and its auth.
	 * @param {string} imageUrl - The image URL string.
	 * @param {string} resizedAuth - The auth string for the resized image.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setImageUrl(imageUrl, resizedAuth) {
		if (imageUrl && resizedAuth) {
			this.customValues.imageUrl = imageUrl;
			this.customValues.resizedAuth = resizedAuth;
		}
		return this;
	}

	/**
	 * Set a custom link URL.
	 * @param {string} linkUrl - The link URL string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setLinkUrl(linkUrl) {
		if (linkUrl) this.customValues.linkUrl = linkUrl;
		return this;
	}

	/**
	 * Set a custom overline.
	 * @param {string} overline - The overline string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setOverline(overline) {
		if (overline) this.customValues.overline = overline;
		return this;
	}

	/**
	 * Set a custom overline URL.
	 * @param {string} overlineURL - The overline URL string.
	 * @return {StoryOverrideValues} The instance of StoryOverrideValues.
	 */
	setOverlineUrl(overlineURL) {
		if (overlineURL) this.customValues.overlineURL = overlineURL;
		return this;
	}
}
