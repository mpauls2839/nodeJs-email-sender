const nodemailer = require('nodemailer');
var http = require('http');
var fs = require('fs');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'habitdentalcompany@gmail.com',
      pass: 'Habit_1290'
  }
});

var mailOptions = {
  from: 'habitdentalcompany@gmail.com',
  to: 'mpauls2839@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

http.createServer(function (req, res) {
  fs.readFile('main.html', function(err, main) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(main);

    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.end();
  });
}).listen(8080)
