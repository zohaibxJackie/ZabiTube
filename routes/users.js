var mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/zabitube");

const userschema = mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    default: 0
  }],
  post: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'video'
  }]
});

userschema.plugin(plm);

module.exports = mongoose.model("users", userschema);