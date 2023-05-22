import { bootstrap } from "./commands/index";
import { config } from "dotenv";
import { Client, Intents } from "discord.js";
import { scdl } from "./services/soundcloud";
import express, { Request, Response } from "express";
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

		client.login(process.env.TOKEN).then(async () => {
			await scdl.connect();
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
		});
	}
}
