const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const movie = require("./movie.model");

const userSchema = new mongoose.Schema({
  username: String,
  passport: String,
  isAdmin: {
    type: Boolean,
    default: false, //defoult is false for regular user
  },
  mylist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
    },
  ],
  watchedMovies: [
    {
      movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
      },
      watchedTime: {
        type: Number,
        default: 0,
      },
      uploadTime : {
        type : Date,
        default:Date.now(),
      }
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
