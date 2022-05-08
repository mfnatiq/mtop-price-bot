Last Updated: 07 May 2022

### Requirements

1. Create an `.env` file in the root folder with the following:

```
DISCORD_BOT_TOKEN=bbb
DISCORD_REALTIME_CHANNEL_ID=ccc    // channel should be a TEXT_CHANNEL; can be obtained by right-clicking channel and selecting "Copy ID"
DISCORD_REALTIME_CHANNEL_WEBHOOK_ID=ddd    // see below for getting this info from discord
DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN=eee
DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID=fff
BOT_DISPLAY_NAME=Mtop Bot
BOT_AVATAR_URL=https://cdn.discordapp.com/icons/944512241900875837/5a17736adb172be4756a28371885bf56.webp?size=240
```

where `DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID` should be the message ID of a single message in a locked voice channel (i.e. create a message there first)

### Scaling to more tokens / NFTs

Append to `tokenPairOneContracts` (for tokens - contract address is the important one, name is just for displaying in discord) and / or `nftkeyInterestedCollectionsByFullName` (for nfts in NFTKEY - requires their _exact_ name in NFTKEY) in `constants.ts`

#### Current Limitations

1. Only works for Harmony tokens / NFT collections
2. NFT collections currently only fetched from NFTKEY

### Discord Bot

#### Requirements

1. Node.js v16.14.0

#### Installation

1. `yarn`

#### Configuring Discord Bot

1. See https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks for discord webhooks; create it for the specific (read-only) channel: first part is the webhook ID, second part is the webhook token
2. Go to the Discord Developer Portal -> click on relevant application -> Bot -> enable all Privileged Gateway Intents

### Running the Application

`yarn build / npm run build` then `yarn start / npm start`

### Building the Application in Docker

1. Create the Dockerfile

```
FROM 16-alpine3.14
WORKDIR /app
COPY package*.json /app/ && COPY yarn.lock /app/ && COPY tsconfig.json /app/
COPY src /app/
RUN yarn
RUN yarn build
CMD ["yarn" , "start"]
```

2. Build the Docker image

`docker buildx build --platform linux/amd64 -t mtop-bot-poc:v0.1.0 .`

3. Run the Docker image

### Run the Application in Docker

1. Make sure you have an .env file with correct values
2. Run the docker image

`docker run mtop-bot-poc:v0.1.0 --env-file .env`
