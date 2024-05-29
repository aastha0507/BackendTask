const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');
const keys = require('./keys');
require('dotenv').config();

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

    //   if (!user || !user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect email or password' });
    //   }

    if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: keys.googleCallbackUrl,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
    //   let user = await User.findOne({ email: profile.emails[0].value });
    let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Create new user if not found
        user = new User({
            googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
        //   avatar: profile.photos[0].value,
          // Set default password or generate random one
          password: bcrypt.hashSync('randompassword', 10)
        });
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Similar strategies for Facebook, Twitter, GitHub

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
