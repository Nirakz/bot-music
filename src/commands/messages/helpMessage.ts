import { schema } from "../../commands/schema";
import messages from "../../constants/messages";
import { BaseApplicationCommandOptionsData, EmbedBuilder } from "discord.js";

export const createHelpMessage = (): EmbedBuilder => {
	const embedMessage = new EmbedBuilder({
		title: messages.help,
		fields: (schema as BaseApplicationCommandOptionsData[]).map((item, index) => ({
			name: `${index + 1}. ${item.name}`,
			value: `${item.description}`,
		})),
	});
	return embedMessage;
};
