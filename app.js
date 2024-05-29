const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const keys = require('./config/keys');
require('dotenv').config();

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
// mongoose
//   .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: false, })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error(err));

async function connectToMongoDB() {
    try {
      await mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, bufferCommands: true });
      console.log('MongoDB connected');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1); // Exit process on connection failure
    }
  }
  connectToMongoDB();

// Passport middleware
app.use(session({
    secret: keys.secretOrKey,
    resave: false,
    saveUninitialized: false
  }));
 app.use(passport.initialize());
 app.use(passport.session());

// Passport config
 require('./config/passport');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
