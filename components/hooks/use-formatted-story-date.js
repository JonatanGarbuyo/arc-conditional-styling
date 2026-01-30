import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";
import { localizeDateTime } from "../utils/localizeDate";

export const useFormattedStoryDate = (date, dateFormatOverride = "") => {
	const { arcSite } = useFusionContext();

	const {
		dateLocalization: { language, timeZone, dateTimeFormat } = {
			language: "en",
			timeZone: "GMT",
			dateFormat: "LLLL d, yyyy 'at' K:m bbbb z",
		},
	} = getProperties(arcSite);

	const dateFormat = dateFormatOverride || dateTimeFormat;

	const displayDate =
		date && !isNaN(Date.parse(date))
			? localizeDateTime(new Date(date), dateFormat, language, timeZone)
			: "";

	return displayDate;
};
