const Discord = require('discord.js');
const { Client, Intents, GatewayIntentBits } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const mysql = require('mysql');
const config = require('./config/config.json');
const messages = require('./config/messages.json');
const express = require('express');
const app = express();

// Discord bot intents
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
});
const prefix = '!';

// Database connection
const db = mysql.createConnection({
  host: config.MySQL.hostname,
  user: config.MySQL.username,
  password: config.MySQL.password,
  database: config.MySQL.databasename
});

db.connect(err => {
  if (err) throw err;
  console.log(messages.database.console.connected);
});

// Start WebAPI
const licenseCheckApi = require('./API/licensecheck')(db);
app.use('/api', licenseCheckApi);

app.listen(8080, () => {
  console.log('WebAPI started on this URL: http://localhost:8080');
});

client.on('ready', () => {
  console.log(`Logined as ${client.user.tag}!`);

  client.guilds.cache.forEach(guild => {
    guild.commands.create({
      name: 'addlicense',
      description: messages.slashcommands.addlicense.description,
      options: [
        {
          name: 'licensekey',
          type: 3,
          description: 'Custom License Key (use "random" to random key)',
          required: true 
        },
        {
          name: 'username',
          type: 3,
          description: 'Buyer mention',
          required: true
        }
      ]
    });    
    console.log(messages.clientready['+addlicense']);

    guild.commands.create({
      name: 'removelicense',
      description: messages.slashcommands.removelicense.description,
      options: [
        {
          name: 'licensekey',
          type: 3,
          description: 'License Key',
          required: true 
        }
      ]
    });
    console.log(messages.clientready['+removelicense']);

    guild.commands.create({
      name: 'resetdatabase',
      description: messages.slashcommands.resetdatabase.description
    });
    console.log(messages.clientready['+resetdatabase']);

    guild.commands.create({
      name: 'editlicensekey',
      description: 'Edit license key in the license system',
      options: [
        {
          name: 'licensekey',
          type: 3,
          description: 'Original license key',
          required: true
        },
        {
          name: 'newlicensekey',
          type: 3,
          description: 'New license key',
          required: true
        }
      ]
    });      
    console.log(messages.clientready['+editlicensekey']);

    guild.commands.create({
      name: 'editlicensebuyer',
      description: messages.slashcommands.editlicensebuyer.description,
      options: [
        {
          name: 'licensekey',
          type: 3,
          description: messages.slashcommands.editlicensebuyer.options.licensekey,
          required: true
        },
        {
          name: 'newbuyer',
          type: 3,
          description: messages.slashcommands.editlicensebuyer.options.newbuyer,
          required: true
        }
      ]
    });
    console.log(messages.clientready['+editlicensebuyer']);

    guild.commands.create({
      name: 'connectedusers',
      description: messages.slashcommands.connectedusers.description,
      options: [
        {
          name: 'licensekey',
          type: 3,
          description: messages.slashcommands.connectedusers.options.licensekey,
          required: true
        }
      ]
    });
    console.log(messages.clientready['+connectedusers']);

    
    //
    //
    // NO WORKING YET
    //
    //
    // guild.commands.create({
    //   name: 'clearips',
    //   description: messages.slashcommands.clearips.description,
    //   options: [
    //     {
    //       name: 'licensekey',
    //       type: 3,
    //       description: messages.slashcommands.clearips.options.licensekey,
    //       required: true 
    //     }
    //   ]
    // });
    // console.log(messages.clientready['+clearips']);
    //
    // guild.commands.create({
    //   name: 'addips',
    //   description: 'Add IP address to license key',
    //   options: [
    //     {
    //       name: 'licensekey',
    //       type: 3,
    //       description: 'License Key',
    //       required: true 
    //     },
    //     {
    //       name: 'ipaddress',
    //       type: 3,
    //       description: 'IP Address',
    //       required: true 
    //     }
    //   ]
    // });
    // console.log(messages.clientready['+addips']);
  });    
});

function genrandomlicensekey() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var code = '';
  for (var i = 0; i < 4; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    var randomCharacter = characters.charAt(randomIndex);
    code += randomCharacter;
  }
  return code;
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'addlicense') {
    const licenseKey = options.getString('licensekey');
    const username = options.getString('username');

    if(licenseKey == "random") {
      const licenseKey1 = genrandomlicensekey();
      const licenseKey2 = genrandomlicensekey();
      const licenseKey3 = genrandomlicensekey();
      const licenseKey4 = genrandomlicensekey();
      const licenseKey = licenseKey1 + "-" + licenseKey2 + "-" + licenseKey3 + "-" + licenseKey4
      const sql = 'INSERT INTO license_table (license_key, username) VALUES (?, ?)';
      db.query(sql, [licenseKey, username], (err, result) => {
        if (err) {
          console.error(err);
          return interaction.reply('Internal error, check console!');
        }
        console.log(`License (${licenseKey}) has been added to license system!`);
        interaction.reply(messages.language.addlicense.msg);
      });
    } else {
      const licenseKey = options.getString('licensekey');
      const sql = 'INSERT INTO license_table (license_key, username) VALUES (?, ?)';
      db.query(sql, [licenseKey, username], (err, result) => {
        if (err) {
          console.error(err);
          return interaction.reply('Internal error, check console!');
        }
        console.log(`License (${licenseKey}) has been added to license system!`);
        interaction.reply(messages.language.addlicense.msg);
      });
    }
  }

  if (commandName === 'removelicense') {
    const licenseKey = options.getString('licensekey');

    const sql = 'DELETE FROM license_table WHERE license_key = ?';
    db.query(sql, [licenseKey], (err, result) => {
      if (err) {
        console.error(err);
        return interaction.reply('Internal error, check console!');
      }
      console.log('License has been removed from license system!!');
      interaction.reply(messages.language.addlicense.msg);
    });
  }
  
  if (commandName === 'resetdatabase') {
    const userId = interaction.user.id;
    const acceptedUserId = messages.language.resetdatabase.alloweduser.userid;
  
    if (userId !== acceptedUserId) {
      return interaction.reply(messages.language.resetdatabase.alloweduser.msg);
    }
  
    const confirmationMessage = messages.language.resetdatabase.msg;
  
    interaction.reply({
      content: confirmationMessage,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3,
              label: messages.language.resetdatabase.buttons.cancel.label,
              custom_id: 'delete_cancel'
            },
            {
              type: 2,
              style: 4,
              label: messages.language.resetdatabase.buttons.delete.label,
              custom_id: 'delete_confirm'
            }
          ]
        }
      ]
    });
  
    const filter = (i) => (i.customId === 'delete_confirm' || i.customId === 'delete_cancel') && i.user.id === userId;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
  
    collector.on('collect', async (i) => {
      if (i.customId === 'delete_cancel') {
        i.reply(messages.language.resetdatabase.buttons.cancel.msg);
        collector.stop();
      } else if (i.customId === 'delete_confirm') {
        const sql = 'DELETE FROM license_table';
        db.query(sql, (err, result) => {
          if (err) {
            console.error(err);
            return i.reply('Internal error, check console!');
          }
  
          console.log('All data has been deleted from the License Database!');
          i.reply(messages.language.resetdatabase.buttons.delete.msg);
        });
  
        collector.stop();
      }
    });
  
    collector.on('end', (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        interaction.followUp(messages.language.resetdatabase.buttons.timeout);
      }
    });
  }  

  if (commandName === 'editlicensekey') {
    const licenseKey = options.getString('licensekey');
    const newLicense = options.getString('newlicensekey');

    if (licenseKey === newLicense) {
        return interaction.reply(messages.language.editlicensekey.wrongformat);
    }
  
    const checkSql = 'SELECT * FROM license_table WHERE license_key = ?';
    db.query(checkSql, [licenseKey], (err, result) => {
      if (err) {
        console.error(err);
        return interaction.reply('Internal error, check console!');
      }
      if (result.length === 0) {
        return interaction.reply(`${messages.language.editlicensekey.doesntexist}`);
      }
  
      const updateSql = 'UPDATE license_table SET license_key = ? WHERE license_key = ?';
      db.query(updateSql, [newLicense, licenseKey], (err, result) => {
        if (err) {
          console.error(err);
          return interaction.reply('Internal error, check console!');
        }
        console.log(licenseKey + ' named key has been updated new key: ' + newLicense);
        interaction.reply(messages.language.editlicensekey.msg);
      });
    });
  }  
  if (commandName === 'editlicensebuyer') {
    const licenseKey = options.getString('licensekey');
    const newbuyer = options.getString('newbuyer');

    if (licenseKey === newbuyer) {
        return interaction.reply(messages.language.editlicensebuyer.wrongformat);
    }
    const checkSql = 'SELECT * FROM license_table WHERE license_key = ?';
    db.query(checkSql, [licenseKey], (err, result) => {
      if (err) {
        console.error(err);
        return interaction.reply('Internal error, check console!');
      }
      if (result.length === 0) {
        return interaction.reply(`${messages.language.editlicensebuyer.doesntexist}`);
      }
    
      if (newbuyer === oldbuyer) {
        return interaction.reply(messages.language.editlicensebuyer.wrongformat2);
      }
    
      const updateSql = 'UPDATE license_table SET buyer = ? WHERE license_key = ?';
      db.query(updateSql, [newbuyer, licenseKey], (err, result) => {
        if (err) {
          console.error(err);
          return interaction.reply('Internal error, check console!');
        }
        console.log(licenseKey + ' named key has been updated with new buyer: ' + newbuyer);
        interaction.reply(messages.language.editlicensebuyer.msg);
      });
    });    
    
  }
  if (commandName === "connectedusers") {
    const licenseKey = options.getString('licensekey');

    const checkSql = 'SELECT username FROM license_table WHERE license_key IN (SELECT license_key FROM license_table WHERE license_key = ?)';
    db.query(checkSql, [licenseKey], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      
      const usernames = results.map(result => result.username);
      if (usernames == 0) {
        const listusernames = "None";
        console.log('Usernames:', usernames);
        interaction.reply(`${messages.language.connectedusers.msg}`)
      } else {
        const listusernames = results.map(result => result.username);
        console.log('Usernames:', usernames);
        interaction.reply(`${messages.language.connectedusers.msg}`)
      }
    });    
  }

  //
  //
  // NO WORKING YET
  //
  //
  // if (commandName === 'clearips') {
  //   const licenseKey = options.getString('licensekey');

  //   const deleteQuery = `UPDATE license_table SET used_ips = NULL WHERE license_key = ?`;
  //   db.query(deleteQuery, [licenseKey], (err) => {
  //     if (err) {
  //       console.error('Error when user want clear license ips:', err.message);
  //       interaction.reply('Error, when you want to use "/clearips" command!');
  //     } else {
  //       console.log(`All IPs cleared of ${licenseKey}`);
  //       interaction.reply(`All IPs has been cleared from your license key!`);
  //     }
  //   });
  //  }
  // if (commandName === 'addips') {
  //   const licenseKey = options.getString('licensekey');
  //   const ipAddress = options.getString('ipAddress');
  
  //   const selectQuery = 'SELECT used_ips FROM license_table WHERE license_key = ?';
  //   db.query(selectQuery, [licenseKey], (err, results) => {
  //     if (err) {
  //       console.error('Hiba történt az adatok lekérdezése során:', err.message);
  //       interaction.reply('Hiba történt az IP cím hozzáadása során.');
  //     } else {
  //       const usedIPs = results[0]?.used_ips || '';
  //       const updatedIPs = usedIPs ? usedIPs + ',' + ipAddress : ipAddress;
  
  //       const updateQuery = 'UPDATE license_table SET used_ips = ? WHERE license_key = ?';
  //       db.query(updateQuery, [updatedIPs, licenseKey], (err) => {
  //         if (err) {
  //           console.error('Hiba történt az adatok frissítése során:', err.message);
  //           interaction.reply('Hiba történt az IP cím hozzáadása során.');
  //         } else {
  //           console.log(`Az ${ipAddress} IP cím sikeresen hozzáadva a ${licenseKey} licensehez.`);
  //           interaction.reply(`${ipAddress} IP address has been added to ${licenseKey}.`);
  //         }
  //       });
  //     }
  //   });
  // }  
});

client.login(config.botsettings.token);
