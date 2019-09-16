const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new Email</p>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    <p>Get a faster, sleeker email experience at email.com</p>
    <p>and you can use your same email address!</p>
  `;

  //transporter object
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: {
      user: 'habitdentalcompany@gmail.com',
      pass: 'Habit_1290'
    },

    //only for running on localhost
    tls:{
      rejectUauthorized: false
    }
  });

  let mailOptions = {
    from: '"From: Mask" <habitdentalcompany@gmail.com>',
    to: req.body.email,
    subject: req.body.subject,
    //text: req.body.message,
    html: output
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: $s', info.messageId);
    console.log('Preview URL: $s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {layout: false}); //{msg:'Email has been sent'});
  });
});

app.listen(3000, () => console.log('Server Started'));
