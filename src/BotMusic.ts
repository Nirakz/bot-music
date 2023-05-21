import { bootstrap } from "../commands/index";
import { config } from "dotenv";
import { Client, Intents } from "discord.js";
config();
if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

export class BotMusic {
	static init() {
		const client = new Client({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_VOICE_STATES,
				Intents.FLAGS.GUILD_INTEGRATIONS,
			],
		});

		client.on("ready", () => {
			console.log(`> Bot is on ready`);
		});

		client.login(process.env.TOKEN).then(() => {
			bootstrap(client);
		});
	}
}
