const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer')
const path = require('path')

const app = express();

const PORT = 3000;

// View Engine Setup
app.engine('handlebars',exphbs({
        extname: "hbs",
        defaultLayout: "",//"main-layout",
        layoutsDir: "",//"views/layouts/"
    }));
app.set('view engine', 'handlebars');

//Body parser MIddleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render("form");
})

app.post('/send', (req, res) => {
   const output = `
   <h2>You have a new covid-19 form submission</h2>
   <h3>Contact Details</h3>
   <ul>
    <li>Name:${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone:${req.body.telephone}</li>
    <li>Question 1: ${req.body.subject1}</li> 
    <li>Question 2: ${req.body.subject2}</li> 
    <li>Question 3: ${req.body.subject3}</li> 
    <li>Question 4: ${req.body.subject4}</li> 
   </ul>
   <h3>Message</h3>
   <p>${req.body.message}</p>
   `;

    //create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'daija.lesch16@ethereal.email', // generated ethereal user
            pass: 'HUCKuKjxTfUpfsgEY3', // generated ethereal password
        },
        tls:{
            rejectUnautharized: false
        }
    });

    // send mail with defined transport object
    let info = {
        from: '"Nodemailer Contact" <hltoktay@gmail.com>', // sender address
        to: "hlt.oktay@hotmail.com", // list of receivers
        subject: "Covid-19 Submission Form ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    };

    // Sned mail with defined transport object
    transporter.sendMail(info, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log('Message send: %s', info.messageId);
        console.log('preview URL: %s', nodemailer.getTestMessageUrl(info))
   
    res.render('form', {msg: 'Form has been send ✔'})
    })
})

app.set('port', ( process.env.PORT || 3000))

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });


// app.listen(PORT, () => console.log('Server running...'))