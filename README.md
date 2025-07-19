# RollBot

A simple Telegram bot for rolling dice, with powerful features thanks to the [rpg-dice-roller](https://github.com/dice-roller/rpg-dice-roller) library.

Deployed to [@nat20_bot](https://t.me/nat20_bot). Message the bot with `/help` for usage instructions.

## Development

Requires git and docker compose (nothing else).

1. Clone the repo
2. Create an `.env.dev` file and add `BOT_TOKEN={your bot api token}`
3. Run `./dev.sh`

-> Editing files in your working directory will sync changes into the running container

<- To add/update dependencies, use `./shell.sh` to enter the container and then run e.g. `bun install foo` inside it. Changes will be synced back to your working directory.
