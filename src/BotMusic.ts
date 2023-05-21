import { config } from "dotenv";
import { Client, IntentsBitField } from "discord.js";
config();
if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

export class BotMusic {
	static  init() {
		const client = new Client({
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildVoiceStates,
				IntentsBitField.Flags.GuildIntegrations,
			],
		});

		client.on("ready", () => {
			console.log(`> Bot is on ready`);
		});

		client.login(process.env.TOKEN);
	}
}
