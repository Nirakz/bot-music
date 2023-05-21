# bot-music

## Overview

bot-Music is a Discord bot that plays music in voice channel. The bot is built on Discord.js v13.

## Requirements

- Node.js v16.6.0 or higher

## Using

- Setup permissions
  - Scopes: `bot`, `application.commands`
  - Bot permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`, `Connect`, `Speak`
- ```bash
  git clone https://github.com/Nirakz/bot-music.git && \
  cd bot-music
  ```
- Create .env file in root directory includes your Discord bot token. `TOKEN = <token>`

- ```bash
  npm i && \
  npm run build && \
  npm run start
  ```

- Invite the bot to the server, then join a voice channel. Send `!start` to deploy the slash command for bot in the server

## Deploy to Heroku

The bot can run continuously on Heroku without sleep. You need to setup 2 `Config Vars` in your Heroku app.

- `TOKEN = <bot token>`
- `APP_URL = <your Heroku app URL>`

## Docs

| ID  | Name       | Description                                                       | Usage                    |
| --- | ---------- | ----------------------------------------------------------------- | ------------------------ |
| 1   | play       | Plays a song or playlist on Youtube with the given name or url    | /play {link/query}       |
| 2   | soundcloud | Plays a song or playlist on SoundCloud with the given name or url | /soundcloud {link/query} |
| 3   | pause      | Pause current song                                                | /pause                   |
| 4   | resume     | Resume current song                                               | /resume                  |
| 5   | skip       | Skip current song                                                 | /skip                    |
| 6   | nowplaying | Get current song info                                             | /nowplaying              |
| 7   | shuffle    | Shuffle the queue                                                 | /shuffle                 |
| 8   | queue      | View songs in queue                                               | /queue                   |
| 9   | jump       | Jump to song in queue by position                                 | /jump {position}         |
| 10  | remove     | Remove song in queue by position                                  | /remove {position}       |
| 11  | ping       | See the ping to server                                            | /ping                    |
| 12  | leave      | Stop and leave audio channel                                      | /leave                   |
| 13  | help       | See the help for this bot                                         | /help                    |
