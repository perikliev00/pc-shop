const express = require('express');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/User');
const adminRoutes = require('./routes/user/adminRoutes');
const adminDataRoutes = require('./routes/data/adminRoutes');
const orderRoutes = require('./routes/user/orderRoutes');
const orderDataRoutes = require('./routes/data/orderRoutes');

const productRoutes = require('./routes/user/productRoutes');
const productDataRoutes = require('./routes/data/productRoutes');
const cartRoutes = require('./routes/user/cartRoutes');
const cartDataRoutes = require('./routes/data/cartRoutes');
const authRoutes = require('./routes/user/authRoutes');
const authDataRoutes = require('./routes/data/authRoutes');
const isAuth = require('./middlewares/isAuth');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const sendGridKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@portfolio.oaldo.mongodb.net/test?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true`;

const app = express();
const port = 3000;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert'); 

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }
)

app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: true,store:store })
)


app.use((req,res,next) => {
  if(!req.session.user) {
      return next();
  }
  User.findById(req.session.user._id)
      .then(user => {
          if(!user) {
              return next();
          }
          req.session.user = user;
          req.session.isLoggedIn = true;
          next();
      })
      .catch(err => { 
          next(new Error(err))     
})
});



app.use(authRoutes);
app.use(authDataRoutes);


app.use(adminRoutes);
app.use(adminDataRoutes);

app.use(orderRoutes);
app.use(orderDataRoutes);


app.use(express.static(path.join(__dirname, 'public')));

// Dynamic image handler: serve from public/images if present, else generate SVG placeholder
app.get(/^\/images\/(.*)$/, (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params[0]);
    const filePath = path.join(__dirname, 'public', 'images', decoded);
    
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    
    // If file doesn't exist, generate a placeholder SVG
    const base = path.parse(decoded).name || 'Product';
    const label = base.substring(0, 40);
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#93c5fd"
        font-family="Arial, Helvetica, sans-serif" font-size="24">${label}</text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#60a5fa"
        font-family="Arial, Helvetica, sans-serif" font-size="14">PCShop</text>
  <rect x="20" y="20" width="360" height="260" fill="none"
        stroke="rgba(59,130,246,0.5)" stroke-width="2" rx="16"/>
</svg>`;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(svg);
  } catch (e) {
    return res.status(404).end();
  }
});

// Static info pages
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'about.html'));
});
app.get('/careers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'careers.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'contact.html'));
});
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'privacy.html'));
});
app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq.html'));
});
app.get('/faq-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq-test.html'));
});
app.get('/simple-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'simple-test.html'));
});
app.get('/faq-standalone', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq-standalone.html'));
});
app.get('/faq-test-simple', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq-test-simple.html'));
});
app.get('/faq-debug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq-debug.html'));
});
app.get('/faq-test-final', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'faq-test-final.html'));
});
app.get('/returns', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'returns.html'));
});
app.use('/', productRoutes);
app.use(productDataRoutes);

app.use(cartRoutes);
app.use(cartDataRoutes);



mongoose
  .connect(MONGODB_URI)
  .then(result => {
    // https.createServer({key: privateKey, cert:certificate },app).listen(process.env.PORT || 3000)
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
