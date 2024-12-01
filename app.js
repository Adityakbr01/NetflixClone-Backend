require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.set("view engine", "hbs");

const Port = 5000;
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URL
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongodb connection error error"));
db.once("open", () => {
  console.log("Connected to mongoDb");
});

const User = require("./models/user.model");
const session = require("express-session");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "abbcccdddd",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URL,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

const passport = require("passport");
const LocalStrategy = require(`passport-local`).Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authroutes = require("./routes/authRouts");
app.use("/", authroutes);

const dashboard = require("./routes/dashboard");
const addmovie = require("./routes/addmovie");
const updatemovieList = require("./routes/updatemovie.router")
const myList = require("./routes/mylist")
const watchedMovies = require("./routes/watchedmoviesRoutes")
const deleteMovie = require("./routes/deleteMovieRoutes")
const allMovies = require("./routes/getallMovies.Router")
app.use("/", dashboard);
app.use("/", addmovie);
app.use("/",updatemovieList)
app.use("/",myList);
app.use("/",watchedMovies);
app.use("/",deleteMovie);
app.use("/",allMovies);

app.listen(Port, () => {
  console.log(`Server Running on Port : ${Port}`);
});
