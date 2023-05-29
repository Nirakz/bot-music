import { bootstrap } from "./commands/index";
import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { SoundCloud } from "scdl-core";
import express, { Request, Response } from "express";
import herokuAwake from 'heroku-awake';
config();
if (process.env.NODE_ENV === "production") {
	require("module-alias/register");
}

export class BotMusic {
	static init() {
		const client = new Client({
			intents: [
				// Intents.FLAGS.GUILDS,
				// Intents.FLAGS.GUILD_MESSAGES,
				// Intents.FLAGS.GUILD_VOICE_STATES,
				// Intents.FLAGS.GUILD_INTEGRATIONS,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildIntegrations,
			],
		});

		client.on("ready", () => {
			console.log(`> Bot is on ready`);
		});

		client.login(process.env.TOKEN).then(async () => {
			await SoundCloud.connect();
			bootstrap(client);
		});

		const app = express();

		app.get("/", (_req: Request, res: Response) => {
			return res.send({
				message: "Bot is running",
			});
		});

		app.listen(process.env.PORT || 3000, () => {
			console.log(`> Bot is on listening`);
			herokuAwake(process.env.APP_URL || 'http://localhost:3000');
		});
	}
}
