import { SoundCloud } from "scdl-core";
import { Platform, Song } from "../types/Song";
import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	entersState,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} from "@discordjs/voice";
import { Snowflake } from "discord.js";
import ytdl from "ytdl-core";

export interface QueueItem {
	song: Song;
	requester: string;
}

export class Server {
	public guildId: string;
	public playing?: QueueItem;
	public queue: QueueItem[];
	public readonly voiceConnection: VoiceConnection;
	public readonly audioPlayer: AudioPlayer;
	private isReady = false;

	constructor(voiceConnection: VoiceConnection, guildId: string) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.queue = [];
		this.playing = undefined;
		this.guildId = guildId;

		this.voiceConnection.on("stateChange", async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				/*
          If the websocket was closed with code 4014 there are 2 possibilities:
          - If it has the ability to reconnect on its own (likely due to changing voice channels), we give it 5s to find out and reconnect.
          - If the bot is kicked from the voice channel, we will destroy the connection.
				*/
				if (
					newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
					newState.closeCode === 4014
				) {
					try {
						await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
					} catch (e) {
						this.leave();
					}
				} else if (this.voiceConnection.rejoinAttempts < 5) {
					this.voiceConnection.rejoin();
				} else {
					this.leave();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				this.leave();
			} else if (
				!this.isReady &&
				(newState.status === VoiceConnectionStatus.Connecting ||
					newState.status === VoiceConnectionStatus.Signalling)
			) {
				/*
			If the connection signal is in the "Connecting" or "Signaling" state, we will wait 20 seconds for the connection to be ready.
          After 20 seconds if the connection fails, we will destroy the connection.
				*/
				this.isReady = true;
				try {
					await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed)
						this.voiceConnection.destroy();
				} finally {
					this.isReady = false;
				}
			}
		});

		// This is the event when a song ends and we move on to a new song.
		this.audioPlayer.on("stateChange", async (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				await this.play();
			}
		});

		voiceConnection.subscribe(this.audioPlayer);
	}

	public async addSongs(queueItems: QueueItem[]): Promise<void> {
		this.queue = this.queue.concat(queueItems);
		if (!this.playing) {
			await this.play();
		}
	}

	public stop(): void {
		this.playing = undefined;
		this.queue = [];
		this.audioPlayer.stop();
	}

	// The bot leaves the voice channel and deletes the current server from the map.
	public leave(): void {
		if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
			this.voiceConnection.destroy();
		}
		this.stop();
		servers.delete(this.guildId);
	}

	// Stop the song playing
	public pause(): void {
		this.audioPlayer.pause();
	}

	// Resume stopped song
	public resume(): void {
		this.audioPlayer.unpause();
	}

	// Skip to the song in the queue
	public async jump(position: number): Promise<QueueItem> {
		const target = this.queue[position - 1];
		this.queue = this.queue.splice(0, position - 1).concat(this.queue.splice(position, this.queue.length - 1));
		this.queue.unshift(target);
		await this.play();
		return target;
	}

	// Delete song in queue
	public remove(position: number): QueueItem {
		return this.queue.splice(position - 1, 1)[0];
	}

	public async play(): Promise<void> {
		try {
			// Play the first song in the queue if the queue is not empty
			if (this.queue.length > 0) {
				this.playing = this.queue.shift() as QueueItem;
				let stream: any;
				const highWaterMark = 1024 * 1024 * 10;
				if (this.playing?.song.platform === Platform.YOUTUBE) {
					stream = ytdl(this.playing.song.url, {
						highWaterMark,
						filter: "audioonly",
						quality: "highestaudio",
					});
				} else {
					stream = await SoundCloud.download(this.playing.song.url, {
						highWaterMark,
					});
				}
				const audioResource = createAudioResource(stream);
				this.audioPlayer.play(audioResource);
			} else {
				// Play the first song in the queue if the queue is not empty Stop playing music, set playing = undefined
				this.playing = undefined;
				this.audioPlayer.stop();
			}
		} catch (e) {
			// If there is a problem with streaming a song, we will continue to play the next song
			this.play();
		}
	}
}

// Map of servers where bot is in voice channel
export const servers = new Map<Snowflake, Server>();
