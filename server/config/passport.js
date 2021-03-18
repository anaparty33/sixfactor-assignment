var GoogleTokenStrategy = require("passport-google-token").Strategy;
var config = require(".");

module.exports = function (passport) {
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
      },
      function (accessToken, refreshToken, profile, done) {
        var user = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          picture: profile._json.picture,
          email: profile.emails[0].value,
          googleProvider: {
            id: profile.id,
            token: accessToken,
          },
        };
        return done(null, user);
      }
    )
  );
};
