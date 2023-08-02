const express = require('express');
const router = express.Router();

function createLicenseCheckApi(connection) {
  router.get('/checklicense', (req, res) => {
    const licenseKey = req.query.licenseKey;

    const sql = "SELECT * FROM license_table WHERE license_key = ?";
    connection.query(sql, [licenseKey], (err, result) => {
      if (err) {
        console.error('Hiba az adatbáziskérés során: ' + err.message);
        res.json({
          status: 'INVALID',
          buyer: ''
        });
      } else {
        if (result.length > 0) {
          const buyer = result[0].username;
          res.json({
            status: 'VALID',
            buyer: buyer
          });
        } else {
          res.json({
            status: 'INVALID',
            buyer: ''
          });
        }
      }
    });
  });

  return router;
}

module.exports = createLicenseCheckApi;