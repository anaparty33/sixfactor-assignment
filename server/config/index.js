const dotenv = require("dotenv");
const path = require('path');
const envPath = path.resolve(process.cwd()+'/server','.env').trim();
dotenv.config({ path: envPath });
module.exports = {
  api_url: process.env.API_URL,
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + "auth/google/callback",
  },
  jwt: {
    expires_in: process.env.JWT_EXPIRES_IN,
    secret: process.env.JWT_SECRET,
  },
};
