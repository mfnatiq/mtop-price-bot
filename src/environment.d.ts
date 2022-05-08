export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN: string;
      DISCORD_REALTIME_CHANNEL_ID: string;
      DISCORD_REALTIME_CHANNEL_WEBHOOK_ID: string;
      DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN: string;
      DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID: string;
      BOT_DISPLAY_NAME: string;
      BOT_AVATAR_URL: string;
    }
  }
}