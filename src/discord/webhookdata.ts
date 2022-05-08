import { Client, ColorResolvable, MessageEmbed } from 'discord.js';
import {
  numMinutesCache,
  nftFloorResponse,
  priceResponse,
} from '../replies/price.command';
import {
  DISCORD_REALTIME_CHANNEL_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN,
} from '../discordBotInit';

import dotenv from 'dotenv';
dotenv.config();

const DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID =
  process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID;

const username = process.env.BOT_DISPLAY_NAME || 'Mtop Price Bot';
const avatarUrl =
  process.env.BOT_AVATAR_URL ||
  'https://cdn.discordapp.com/icons/944512241900875837/5a17736adb172be4756a28371885bf56.webp?size=240';

interface SectionData {
  colour: ColorResolvable;
  authorIconUrl: string;
  authorName: string;
}

// all colours taken from sampling each image (in authorIconUrl) with https://imagecolorpicker.com/en
const sectionsData: SectionData[] = [
  {
    colour: '#6277c3',
    authorIconUrl:
      'https://www.freepnglogos.com/uploads/discord-logo-png/discord-logo-logodownload-download-logotipos-1.png',
    authorName: 'If you like what you see...',
  },
  {
    colour: '#3ddacf',
    authorIconUrl:
      'https://s2.coinmarketcap.com/static/img/coins/200x200/3945.png',
    authorName: 'Token Prices (A-Z except ONE)',
  },
  {
    colour: '#fece82',
    authorIconUrl:
      'https://cdn.discordapp.com/icons/944512241900875837/5a17736adb172be4756a28371885bf56.webp?size=240',
    authorName: 'NFTKEY Data (A-Z)',
  },
];

import * as fs from 'fs';

export const updateRealtimeChannelPriceData = async (discordClient: Client) => {
  try {
    const realtimeChannel = discordClient.channels.cache.get(
      DISCORD_REALTIME_CHANNEL_ID
    );
    if (realtimeChannel) {
      const webhook = await realtimeChannel.client.fetchWebhook(
        DISCORD_REALTIME_CHANNEL_WEBHOOK_ID,
        DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN
      );

      try {
        (async () => {
          while (true) {
            const embedMessage = await getEmbedMessage();

            const fileMsgId = fs.readFileSync('src/messageId.txt', 'utf8');
            const existingMessageId =
              fileMsgId || DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID;

            try {
              await webhook.editMessage(existingMessageId, {
                embeds: embedMessage,
              });

              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * 60 * numMinutesCache)
              );
            } catch (err) {
              console.log('webhook edit message error');
              console.log(err);

              try {
                await webhook.fetchMessage(existingMessageId);
              } catch (fetchMessageErr) {
                const newMessage = await webhook.send({
                  username: username,
                  avatarURL: avatarUrl,
                  embeds: embedMessage,
                });
                fs.writeFileSync('src/messageId.txt', newMessage.id);
              }
            }
          }
        })();
      } catch (embedMessageErr) {
        console.log('fetching embed message error');
        console.log(embedMessageErr);

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * 60 * numMinutesCache)
        );
      }
    }
  } catch (err) {
    console.log('webhook error');
    console.log(err);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
};

const getEmbedMessage = async (): Promise<MessageEmbed[]> => {
  return [
    new MessageEmbed()
      .setDescription('Tip fnatiq!')
      .setAuthor({
        name: sectionsData[0].authorName,
        iconURL: sectionsData[0].authorIconUrl,
      })
      .setColor(sectionsData[0].colour),

    new MessageEmbed()
      .setDescription(priceResponse)
      .setAuthor({
        name: sectionsData[1].authorName,
        iconURL: sectionsData[1].authorIconUrl,
      })
      .setColor(sectionsData[1].colour),

    new MessageEmbed()
      .setDescription(nftFloorResponse || 'Fetching NFTs data...')
      .setAuthor({
        name: sectionsData[2].authorName,
        iconURL: sectionsData[2].authorIconUrl,
      })
      .setColor(sectionsData[2].colour),
  ];
};
