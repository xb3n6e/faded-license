// This code is compatible with the node.js language!

const Discord = require('discord.js');
const { Client, Intents, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');

const bottoken = "MTEwODgyMDA4MzkyNjYzMDUwMQ.Ga0pww.FXxPLm0j7PMWafFTq0PpSOV1F6553yd4GWMlK8";
const importLicense = `You can change the license access path line of 99!`;
const ResponseURL = `http://localhost:8080/api/checklicense?licenseKey=${licenseKey}`;

// Discord bot intents
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
});

// License System
const name = "FadedLicense-Dev";
const discordlink = "discord.gg/xb3n6e";

const fetchLicenseData = async (licenseKey) => {
  const URL = ResponseURL;
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function checkLicense(licenseKey) {
  try {
    const data = await fetchLicenseData(licenseKey);
    const status = data.status;
    const buyer = data.buyer;

    if (status === "VALID") {
      let responseMsg = "";
      if (!buyer) {
        responseMsg = 
        `
        
          Dear, N/A! (undefined user)
          Your license is VALID
          For support join our discord server ${discordlink}
        
        `;
      } else {
        responseMsg =
        `
        
          Dear, ${buyer}!
          Your license is VALID
          For support join our discord server ${discordlink}
          
        `;
      }

      console.log("");
      console.log(responseMsg);
      console.log("");
      // Paste here your function call! Example: sendMessage();
      sendMessage();
    } else if (status === "INVALID") {
      const responseMsg =
      `

        Dear, N/A!
        Your license is INVALID (${licenseKey})
        For support join our discord server ${discordlink}

      `;
      console.log("");
      console.log(responseMsg);
      console.log("");
      process.exit(1);
    } else {
      console.log("Invalid response from server");
    }
  } catch (error) {
    console.error(error);
    console.log("Error occurred while processing the license check");
  }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Enabling ${name}..`);
    console.log("");
    console.log("FadedLicense is responsible for the security of the plugin!");
    console.log("https://builtbybit.com/resources/fade-license-system.29041/");
    console.log("");

    // Import license key
    try {
      const configFile = fs.readFileSync('./config.yml', 'utf8');
      const config = yaml.load(configFile);
      const licenseKey = config.license.key;
      checkLicense(licenseKey);
    } catch (error) {
      console.error('Error when FadedLicense want to read config.yml! Error:', error);
    }
});

function sendMessage() {
  console.log("sendMessage() function!")
}

client.login(bottoken);
