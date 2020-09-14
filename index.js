require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 4000;
const EmailCtrl = require('./mainCtrl');

app.use(bodyParser.json());
const whitelist = ['http://localhost:3000', 'https://parrillerosvictoria.com'];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors('*'));

//email route
app.post('/email', EmailCtrl.sendEmail);

app.listen(PORT, () => {
  console.log('server running on port ', PORT);
})

// emisor de particulas
// capa de agua opcidad-10%
// capa burbujas atrás
// logo  