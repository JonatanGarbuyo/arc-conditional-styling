import { useFusionContext } from "fusion:context";

export default function useFormatLiveblogDate(timestamp) {
	const { siteProperties } = useFusionContext();
	const { timeZone = "GMT" } = siteProperties?.dateLocalization || {};

	const date = new Date(timestamp);

	const datetimeString = date.toISOString();

	const formatDateOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone,
	};
	const formatTimeOptions = {
		hour: "2-digit",
		minute: "2-digit",
		timeZone,
	};

	const timeString = new Intl.DateTimeFormat("es-ES", formatTimeOptions).format(date);
	let dateString = new Intl.DateTimeFormat("es-ES", formatDateOptions).format(date);

	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	const formatTodayYesterdayOptions = {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};

	const formattedToday = new Intl.DateTimeFormat("es-Es", formatTodayYesterdayOptions).format(
		today,
	);
	const formattedYesterday = new Intl.DateTimeFormat("es-Es", formatTodayYesterdayOptions).format(
		yesterday,
	);

	// Compare the current date with the date of the article
	if (dateString.includes(formattedToday)) {
		dateString = "hoy";
	}
	if (dateString.includes(formattedYesterday)) {
		dateString = "ayer";
	}

	return {
		time: timeString,
		date: dateString,
		datetime: datetimeString,
	};
}
