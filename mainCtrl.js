const nodemailer = require('nodemailer');
const Jimp = require('jimp');

// email sender function
exports.sendEmail = async function (req, res) {
  const { name, certificate, email } = req.body;
  console.log('variables: ', name, certificate, email);
  //if you are following along, create the following 2 images relative to this script:
  //let imgRaw = ' https://containerwanda.s3-us-west-2.amazonaws.com/Cerficadov2.jpg'; //a 1024px x 1024px backgroound image
  let imgRaw = certificate;
  //---

  let imgActive = './image.jpg';
  let imgExported = './image1.jpg';

  let textData = {
    text: name, //the text to be rendered on the image
    maxWidth: 450, //image width - 10px margin left - 10px margin right
    maxHeight: 72 + 20, //logo height + margin
    placementX: 400, // 10px in on the x axis
    placementY: 350, //bottom of the image: height - maxHeight - margin 
  };

  const htmlString = `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>
  </title>
  <!--[if !mso]><!-- -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    p {
      display: block;
      margin: 13px 0;
    }
  </style>
  <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    @import url(https://fonts.googleapis.com/css2?family=Anton&display=swap);
  </style>
  <!--<![endif]-->
  <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    }
  </style>
  <style type="text/css">
  </style>
</head>

<body>
  <div style="">
    <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      
        <v:rect  style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
        <v:fill  origin="0.5, 0" position="0.5, 0" src="https://parrillerosvictoria.com/img/Cerficadov2.jpg" type="tile" />
        <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
      <![endif]-->
    <div style="background:url(https://parrillerosvictoria.com/img/Cerficadov2.jpg) top center / contain no-repeat;margin:0px auto;max-width:600px;">
      <div style="line-height:0;font-size:0;">
        <table align="center" background="https://parrillerosvictoria.com/img/Cerficadov2.jpg" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:url(https://parrillerosvictoria.com/img/Cerficadov2.jpg) top center / contain no-repeat;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:middle;width:600px;"
            >
          <![endif]-->
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%">
                    <tr>
                      <td align="center" style="font-size:0px;padding:10px 25px;padding-top:22%;padding-bottom:28%;word-break:break-word;">
                        <div style="font-family:Anton, Arial;font-size:25px;line-height:1;text-align:center;color:#FFA903;">${name}</div>
                      </td>
                    </tr>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--[if mso | IE]>
        </v:textbox>
      </v:rect>
    
          </td>
        </tr>
      </table>
      <![endif]-->
  </div>
</body>

</html>`;


  await Jimp.read({
    url: imgRaw, // Required!
    headers: {
      rejectUnauthorized: false
    },
  })
    .then(tpl => (tpl.clone().write(imgActive)))

    //read cloned (active) image
    .then(() => (Jimp.read(imgActive)))

    //combine logo into image

    //load font	
    .then(tpl => (
      Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
    ))

    //add footer text
    .then(data => {
      tpl = data[0];
      font = data[1];

      return tpl.print(font, textData.placementX, textData.placementY, {
        text: textData.text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      }, textData.maxWidth, textData.maxHeight);
    })

    //export image
    .then(tpl => (tpl.quality(100).write(imgExported)))

    //log exported filename
    .then(tpl => {
      console.log('exported file: ' + imgExported);
    })

    //catch errors
    .catch(err => {
      console.error(err);
    });
  // Definimos el transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_EMAIL
    }
  });
  // Definimos el email
  const mailOptions = {
    from: 'Remitente',
    to: email,
    subject: `Certificado Parrilleros, ¡Felicidades ${name}!`,
    html: htmlString,
    attachments: [
      {   // filename and content type is derived from path
        path: imgExported,
      },
    ],
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(500, error.message);
    } else {
      //read template & clone raw image 
      console.log("Email sent");
      res.status(200).send(req.body);
    }
  });
};