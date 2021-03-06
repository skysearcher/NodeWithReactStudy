const keys = require('../config/keys');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // This uses find by id not findone
  User.findById(id).then(user => {
    done(null, user);
  });
});


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    // (accessToken, refreshToken, profile, done) => { OLD CODE JUST SHOWING THE DIFFERENT WAY OF GRABBING STUFF
    //   User.findOne({ googleId: profile.id }).then( existingUser => {
    //     if (existingUser) {
    //       done(null, existingUser);
    //     } else {
    //       new User({ googleId: profile.id })
    //         .save()
    //         .then(user => {
    //           done(null, user);
    //       });
    //     }
    //   });
    // }
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  ));