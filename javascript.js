const fs = require('fs');
const yaml = require('js-yaml');
const mysql = require('mysql');

function checkLicense() {
  // Database settings
  const db_host = 'host'
  const db_user = 'username'
  const db_password = 'password'
  const db_name = 'yourdatabase'

  // Reading user license key and discord username
  try {
    const licenseData = yaml.load(fs.readFileSync('license.yml', 'utf8'));
    const licenseCode = licenseData.license;
    const discordUsername = licenseData.discord_username;

    // Create connection to the database
    const connection = mysql.createConnection({
      host: db_host,
      user: db_user,
      password: db_password,
      database: db_name
    });

    // Connect to the database
    connection.connect((err) => {
      if (err) {
        console.error('ERROR: Failed to connect to the database.');
        return;
      }

      // Retrieve user's discord username
      connection.query('SELECT user_id FROM users WHERE discord_username = ?', discordUsername, (err, results) => {
        if (err) {
          console.error('ERROR: Failed to execute the database query.');
          console.error('ERROR LOG:', err);
          return;
        }

        if (results.length === 0) {
          console.error('ERROR: The user cannot be found in the database.');
          return;
        }

        const userId = results[0].user_id;

        // Check user's license key
        connection.query('SELECT * FROM users WHERE license_key = ? AND user_id = ?', [licenseCode, userId], (err, results) => {
          if (err) {
            console.error('ERROR: Failed to execute the database query.');
            console.error('ERROR LOG:', err);
            return;
          }

          if (results.length === 0) {
            console.error('ERROR: Your license is not valid.');
          } else {
            console.log('Your license is valid!');
            main();
            // Here is your function
          }

          // Close connection with the database
          connection.end();
        });
      });
    });
  } catch (error) {
    console.error('ERROR: Invalid YAML file.');
  }
}

// Start license system
checkLicense();

function main() {
  console.log('You are in the main window!');
  process.exit();
}