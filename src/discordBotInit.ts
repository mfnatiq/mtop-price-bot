import 'reflect-metadata';
import { Intents, Interaction, Message } from 'discord.js';
import { Client } from 'discordx';
import { dirname, importx } from '@discordx/importer';

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
export const DISCORD_REALTIME_CHANNEL_ID = process.env.DISCORD_REALTIME_CHANNEL_ID
export const DISCORD_REALTIME_CHANNEL_WEBHOOK_ID = process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_ID
export const DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN = process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN

import { updateRealtimeChannelPriceData } from './discord/webhookdata';

const discordClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  // If you only want to use global commands only, comment this line
  botGuilds: [
    (discordClient) => discordClient.guilds.cache.map((guild) => guild.id),
  ],
});

discordClient.once('ready', async () => {
  // make sure all guilds are in cache
  await discordClient.guilds.fetch();

  // // clear all guild commands
  // // useful when moving to global commands from guild commands
  // await discordClient.clearApplicationCommands(
  //   ...discordClient.guilds.cache.map((g) => g.id)
  // );

  // init all application commands
  await discordClient.initApplicationCommands({
    guild: { log: true },
    global: { log: true },
  });

  await discordClient.channels.fetch(DISCORD_REALTIME_CHANNEL_ID);

  await updateRealtimeChannelPriceData(discordClient);

  // init permissions; enabled log to see changes
  await discordClient.initApplicationPermissions(true);

  console.log('Discord bot started');
});

discordClient.on('interactionCreate', (interaction: Interaction) => {
  discordClient.executeInteraction(interaction);
});

discordClient.on('messageCreate', (message: Message) => {
  discordClient.executeCommand(message);
});

export async function discordBotInit() {
  // with cjs
  // await importx(__dirname + '/{discord,replies}/**/*.{ts,js}');
  // with ems
  await importx(
    dirname(import.meta.url) + '/{discord,replies,resources,utils}/**/*.{ts,js}'
  );

  await discordClient.login(DISCORD_BOT_TOKEN);
}
