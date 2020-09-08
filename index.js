require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 4000;
const EmailCtrl = require('./mainCtrl');

app.use(bodyParser.json());
app.use(cors());

//email route
app.post('/email', EmailCtrl.sendEmail);

app.listen(PORT, () => {
  console.log('server running on port ', PORT);
})