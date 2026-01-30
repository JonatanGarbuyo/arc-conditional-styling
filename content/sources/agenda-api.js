import axios from "axios";
import { AGENDA_API_BASE_URL } from "fusion:environment";
import handleFetchError from "../utils/handle-fetch-error";

const params = [];

const fetch = async () => {
	const url = `${AGENDA_API_BASE_URL}/agenda`;

	try {
		const bodyPayload = { id: "" };

		const response = await axios.post(url, bodyPayload);

		const agendaData = response?.data?.body || [];

		return {
			agenda: agendaData,
		};
	} catch (error) {
		return handleFetchError(error);
	}
};

export default {
	fetch,
	params,
	label: "Data Source: Agenda de Partidos (API)",
};
