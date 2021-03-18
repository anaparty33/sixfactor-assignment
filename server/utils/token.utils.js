var jwt = require("jsonwebtoken");
const getIP = require('external-ip')();
const config = require("../config");

var createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expires_in,
    }
  );
};

module.exports = {
  generateToken: function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  logIPAddress: async function (req, res, next) {

    // req.user.last_ip = req.connection.remoteAddress;
    getIP((err, ip) => {
      if (err) {
        // every service in the list has failed
        throw err;
      }
      req.user.last_ip = ip;
      return next();
    });
  },
  sendToken: function (req, res) {
    res.setHeader("x-auth-token", req.token);
    return res.status(200).send(JSON.stringify(req.user));
  },
};
