const nodemailer = require('nodemailer');
const { uuid } = require('uuidv4');
const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');

// email sender function
exports.sendEmail = async function (req, res) {
  const { name, certificate, email } = req.body;

  if (!name || !certificate || !email) {
    res.send({ error: true, message: 'debe enviar { name: "name", certificate: "url con imagen", email: "email@ejemplo.com"}' })
  }

  const fileName = `${uuid()}.png`;

  const htmlString = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" type="text/css">
    <title>Document</title>
    <style>
      body {
        width: 1246px;
        height: 892px;
        margin: 0;
        padding: 0;
      }
      .container {
        min-width: 100%;
        height: 100%;
        position: relative;
        margin: 0;
        padding: 0;
      }
  
      .cont-cert {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
  
      img {
        width: 100;
      }
  
      p {
        text-align: center;
        text-transform: uppercase;
        position: absolute;
        top: 40%;
        font-size: 40px;
        color: #F6A902;
        width: 100%;
        font-family: 'Anton', sans-serif;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <figure class="cont-cert">
        <img src=${certificate} />
        <p>${name}</p>
      </figure>
    </div>
  </body>
  
  </html>`;

  await nodeHtmlToImage({
    output: fileName,
    html: htmlString,
  });
  //if you are following along, create the following 2 images relative to this script:
  //let imgRaw = ' https://containerwanda.s3-us-west-2.amazonaws.com/Cerficadov2.jpg'; //a 1024px x 1024px backgroound image



  const mailOptions = {
    from: 'Remitente',
    to: email,
    subject: `Certificado Parrilleros, ¡Felicidades ${name}!`,
    html: htmlString,
    attachments: [
      {   // filename and content type is derived from path
        path: `./${fileName}`,
      },
    ],
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    }
  });
  // Definimos el email

  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      console.log(error);
      fs.unlink(`./${fileName}`, (err) => {
        if (err) console.log(err);
        console.log('file removed')
      });
      res.send({ error: true, message: 'Error email' });
    } else {
      //read template & clone raw image 
      console.log("Email sent");
      fs.unlink(`./${fileName}`, (err) => {
        if (err) console.log(err);
        console.log('file removed')
      });
      res.send({ error: false, message: 'Email sent' });
    }
  });
};