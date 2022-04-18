const express = require("express");
const mongoose = require("mongoose");
//verify jwt token
const verifyJwt = require("./middlewares/verifyJwt"); //verify jwt token
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const cors = require("cors");
const fsPromises = require("fs").promises;
const app = express();
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middlewares/credentials");

//connect to mongoDB using localhost
mongoose.connect(process.env.DBSRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//custom middlewares
app.use(logger);

//allow credentials middlewares
app.use(credentials);

//cors
app.use(cors(corsOptions));
//built in middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middlewares for cookie
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

//api
app.use("/register", require("./routes/api/register"));
app.use("/login", require("./routes/api/login"));
app.use("/refresh", require("./routes/api/refresh"));
app.use("/logout", require("./routes/api/logout"));

//verify jwt token
app.use(verifyJwt);
app.use("/employees", require("./routes/api/employees"));

//404
app.all("/*", (req, res) => {
  //send a 404 error
  res.status(404);
  if (req.accepts("text/html")) {
    res.sendFile(path.join(__dirname, "public", "404.html"));
  } else if (req.accepts("application/json")) {
    res.json({ err: "NOT FOUND" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//catch all errors
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log("listening on port " + PORT));
