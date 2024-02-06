var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/zabitube");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String
  },
  video: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: 0
  }],
  // this will store the comments
  comments: [{
    type: String,
  }],
  // this will store the id of the user who commented
  commentuser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  date: {
    type: Date,
    default: Date.now,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
});


module.exports = mongoose.model('video', videoSchema);