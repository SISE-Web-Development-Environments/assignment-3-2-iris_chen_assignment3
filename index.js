const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");

//#region global imports
const axios = require("axios");
const CryptoJS = require("crypto-js");
require("dotenv").config();

//#endregion
//#region express configures

const asyncHandler = require("express-async-handler");
// require("express-async-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
const cookies_options = {
  maxAge: 1000 * 60 * 15, // would expire after 15 minutes
  httpOnly: true, // The cookie only accessible by the web server
  signed: true // Indicates if the cookie should be signed
};
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(cookieParser(process.env.COOKIE_SECRET, cookies_options)); //Parse the cookies into the req.cookies
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

const users = require("./routes/users");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");

const port = 3000;
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));
app.use(
    session({
        cookieName: "session",
        secret: "abc123",
        duration: 20 * 1000,
        activeDuration: 0,
        id: null,
    })
);

app.use(auth);
app.use("/users",users);
app.use("/recipes",recipes);
// app.use((req,res) => res.sendStatus(404));


app.get("/alive", (req,res) => {
    res.send("I'm alive");
});

app.listen(port, () => {
    console.log('Example app listening on port 3000');
});