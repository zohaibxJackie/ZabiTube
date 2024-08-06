var express = require('express');
var router = express.Router();
// require the models
const userModel = require('./users');
const videoModel = require('./posts');
// This will make the user login
const passport = require('passport');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
// This is to require multer which used for uploading images
const upload = require('./multer');

/* GET home page. */
router.get('/register', function (req, res, next) {
  try {
    res.render('Register');
  } catch (error) {
    res.send("something went wrong")
  }
});

// this will be the feed or home page
router.get('/index', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate('profileImage');
  const posts = await videoModel.find().populate("uploader")
  res.render('feed', { posts, user });
});

router.get('/upload', isLoggedIn, function (req, res, next) {
  res.render('upload');
});

router.get('/', function (req, res) {
  res.render('login', { error: req.flash('error') });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  let user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate({
      path: 'post',
      populate: {
        path: 'uploader',
        model: 'users',
        select: 'profileImage'
      }
    })
  const totalLikes = user.post.reduce((sum, vid) => sum + vid.likes.length, 0);
  res.render('profile', { user, totalLikes });
});

// This is to see posts of all users
router.get('/feed', isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    let posts = await videoModel.find()
      .populate("user")
    res.render("feed", { user, posts });
  } catch (error) {
    res.send("something went wrong");
  }
});

router.get("/likes/post/:id", isLoggedIn, async function (req, res) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await videoModel.findOne({ _id: req.params.id });
    if (post.likes.indexOf(user._id) === -1) {
      post.likes.push(user._id);
    }
    else {
      post.likes.splice(post.likes.indexOf(user._id), 1);
    }
    await post.save();
    res.redirect('back');
  } catch (error) {
    res.send("error in liking")
  }
})

router.get('/watchvideo/:id', isLoggedIn, async function (req, res) {
  try {
    let video = await videoModel.findOne({ _id: req.params.id }).populate(['uploader', 'commentuser']);
    let user = await userModel.findOne({ username: req.session.passport.user })
    let allvideos = await videoModel.find().populate('uploader');
    res.render('video', { video, user, allvideos })
  } catch (error) {
    res.send("error in videos")
  }
})

router.post('/comment/:id', isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ username: req.session.passport.user })
    let post = await videoModel.findOne({ _id: req.params.id })
    let comment = req.body.comment
    post.comments.push(comment)
    post.commentuser.push(user._id)
    await post.save()
    res.redirect('back')
  } catch (error) {
    res.send("something went wrong");
  }
})


router.post('/search', async function (req, res) {
  try {
    let query = req.body.search;
    var regex = new RegExp("^" + query + "$", "i");
    let posts = await videoModel.find({ title: regex }).populate('uploader');
    if (posts[0] != null) {
      res.render("search_result", { posts });
    } else {
      res.send("Oops! no such content available");
    }
  } catch (error) {
    res.send("something went wrong");
  }
});

router.post('/follow/:id', async function (req, res) {
  try {
    let user = await videoModel.findOne({ _id: req.params.id }).populate('uploader');
    let currentUser = await userModel.findOne({ username: req.session.passport.user })
    if (user.uploader.followers.indexOf(currentUser._id) === -1) {
      user.uploader.followers.push(currentUser._id);
    } else {
      user.uploader.followers.splice(user.uploader.followers.indexOf(currentUser._id), 1);
    }
    await user.uploader.save()
    res.redirect('back')
  } catch (error) {
    res.send("Problems in following")
  }
})

// This is to upload the files through multer
router.post('/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async function (req, res, next) {
  // Now, the file is created but it is not uploaded to any detabase. so we have to link it to database by giveing the post user id(who uploaded it) and the user must have the post id. so that we know who created the post and which user have created how many posts
  try {
    if (!req.files) {
      return res.status(404).send("File not uploaded due to some error");
    }
    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await videoModel.create({
      title: req.body.title,
      description: req.body.description,
      video: req.files['video'][0].filename,
      thumbnail: req.files['thumbnail'][0].filename,
      uploader: user._id
    })
    user.post.push(post._id)
    await user.save();
    res.redirect('/profile');
  } catch (error) {
    res.send("Error in uploading file")
  }
});

router.post('/uploadProfile', upload.single('profileImage'), async function (req, res) {
  try {
    if (!req.file) {
      return res.status(404).send("File not uploaded");
    }

    let user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;

    await user.save();
    res.redirect('/profile');
  } catch (error) {
    res.status(500).send("Error uploading profile image");
  }
});


router.post('/register', async function (req, res, next) {
  try {
    const { username, email, fullname } = req.body;
    const userdata = new userModel({ username, email, fullname });

    userModel.register(userdata, req.body.password)
      .then(function () {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/profile');
        });
      })
  } catch (error) {
    res.send("something went wrong");
  }
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/index",
  failureRedirect: "/",
  // This will create the error message
  failureFlash: true
}), function (req, res) { })


router.get('/logout', function (req, res) {
  try {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  } catch (error) {
    res.send("something went wrong");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;