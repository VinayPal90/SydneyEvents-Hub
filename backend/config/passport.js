const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Apne User model ka path check kar lena

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // YE LINE SABSE ZAROORI HAI: Render par process.env.CALLBACK_URL use hoga
      callbackURL: process.env.CALLBACK_URL || "http://localhost:5000/auth/google/callback",
      proxy: true // Render/Heroku jaise platforms ke liye zaroori hai
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // If new user, create in DB
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        });
        done(null, user);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

module.exports = passport;
