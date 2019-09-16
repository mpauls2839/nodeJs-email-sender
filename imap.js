var Imap = require('imap')
var inspect = require('util').inspect;
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
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

var imap = new Imap({
  user: 'habitdentalcompany@gmail.com',
  password: 'Habit_1290',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    var f = imap.seq.fetch('1:1', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    });
    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
        });
      });
      msg.once('attributes', function(attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
  });
  app.post('/send', (req, res) => {
    const output = `
      <p>You have a new Email</p>
      <h3>Message</h3>
      <p>${req.body.message}</p>
      <p>Get a faster, sleeker email experience at email.com</p>
      <p>and you can use your same email address!</p>
    `;
});

imap.once('error', function(err) {
  console.log(err);
});

imap.connect();
app.listen(3000, () => console.log('Server Started'));
