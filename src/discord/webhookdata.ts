import { Client, ColorResolvable, MessageEmbed } from 'discord.js';
import {
  numMinutesCache,
  nftFloorResponse,
  priceResponse,
} from '../replies/price.command';
// import { getCLNYStats } from '../replies/stats.command';
import {
  DISCORD_REALTIME_CHANNEL_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN,
  BOT_DISPLAY_NAME,
  BOT_AVATAR_URL,
} from '../secrets';

const username = BOT_DISPLAY_NAME || 'WenLambo Bot';
const avatarUrl = BOT_AVATAR_URL || 'https://app.wenlambo.one/images/logo.png';

interface SectionData {
  colour: ColorResolvable;
  authorIconUrl: string;
  authorName: string;
}

// all colours taken from sampling each image (in authorIconUrl) with https://imagecolorpicker.com/en
const sectionsData: SectionData[] = [
  {
    colour: '#3ddacf',
    authorIconUrl:
      'https://s2.coinmarketcap.com/static/img/coins/200x200/3945.png',
    authorName: 'Token Prices',
  },
  {
    colour: '#f6c83a',
    authorIconUrl:
      'https://cdn.discordapp.com/icons/944512241900875837/5a17736adb172be4756a28371885bf56.webp?size=240',
    authorName: 'NFTKEY Data',
  },
];

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
            try {
              let embedMessage = await getEmbedMessage();
              webhook.editMessage(DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID, {
                embeds: embedMessage,
              });

              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * 60 * numMinutesCache)
              );
            } catch (err) {
              console.log('webhook edit message error');
              console.log(err);
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
      .setDescription(priceResponse)
      .setAuthor({
        name: sectionsData[0].authorName,
        iconURL: sectionsData[0].authorIconUrl,
      })
      .setColor(sectionsData[0].colour),

    new MessageEmbed()
      .setDescription(nftFloorResponse || 'Fetching NFTs data...')
      .setAuthor({
        name: sectionsData[1].authorName,
        iconURL: sectionsData[1].authorIconUrl,
      })
      .setColor(sectionsData[1].colour),
  ];
};
