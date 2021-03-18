// const http = require("http");
const passport = require("passport");
const port = normalizePort(process.env.PORT || "4000");
const open = require('open');
// const config = require("./config");

require("./config/passport")(passport);

const app = require("./app");
// app.set("port", port);
// const server = http.createServer(app);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// const expressServerUtils = require("express-server-utils")(server, port);
// expressServerUtils.listen();
// expressServerUtils.handleOnError();
// expressServerUtils.handleOnListening();

// const exitActions = [server.close];
// expressServerUtils.handleShutDown(exitActions);




app.listen(port, function (err) {
  if (err) {
      console.log(err);
  } else {
      open(`http://localhost:${port}/signin`);
  }
});
