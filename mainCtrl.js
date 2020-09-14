const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');
const nodeHtmlToImage = require('node-html-to-image');

// email sender function
exports.sendEmail = async function (req, res) {
  const { name, certificate, email } = req.body;

  if (!name || !certificate || !email) {
    res.send({ error: true, message: 'debe enviar { name: "name", certificate: "url con imagen", email: "email@ejemplo.com"}' })
  }

  await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

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

  const img = await nodeHtmlToImage({
    html: htmlString,
  })

  const mailOptions = {
    from: 'Remitente',
    to: email,
    subject: `Certificado Parrilleros, ¡Felicidades ${name}!`,
    html: htmlString,
    attachments: [
      {   // filename and content type is derived from path
        filename: 'certificado.png',
        content: Buffer.from(img, 'base64'),
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
      res.send({ error: true, message: 'Error email' });
    } else {
      //read template & clone raw image 
      console.log("Email sent");
      res.send({ error: false, message: 'Email sent' });
    }
  });
};