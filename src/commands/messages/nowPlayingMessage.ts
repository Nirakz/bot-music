import { title } from "process";
import messages from "../../constants/messages";
import { Platform } from "../../types/Song";
import { formatSeconds } from "../../utils/formatTime";
import { EmbedField, EmbedBuilder } from "discord.js";

export const createNowPlayingMessage = (payload: {
	title: string;
	url: string;
	author: string;
	thumbnail: string;
	length: number;
	platform: Platform;
	requester: string;
}): EmbedBuilder => {
	const author: EmbedField = {
		name: messages.author,
		value: payload.author,
		inline: true,
	};
	const length: EmbedField = {
		name: messages.length,
		value: formatSeconds(payload.length),
		inline: true,
	};
	return new EmbedBuilder()
		.setTitle(payload.title)
		.setURL(payload.url)
		.setAuthor({ name: `${messages.addedToQueue} ${payload.requester}` })
		.setThumbnail(payload.thumbnail)
		.addFields(author, length);
};
