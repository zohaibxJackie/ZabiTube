Project: ZabiTube

ZabiTube is a YouTube clone created solely for learning purposes. If anyone wants to contribute to this project, please feel free to do so; there are no copyrights on this project.

The logo of this project was created by the creator of the project, and it's based on the idea that "You can learn anything you want".

## HIGHTLIGHTING FEATURES

--> Create account

-->Login account

-->Profile customization

-->Upload Video with thumbnail image just like in YouTube

-->Like and Subscribe feature

-->Search video

-->Feed page to watch videos of other creators

-->Full responsive design

## TECHNICAL INFORMATION

Talking about the code, it is pretty simple and self-explanatory. The following are the libraries used and their purposes:

|  Library |  Puropose 
|----------|----------
| Passport | For authentication
| passport-local-mongoose | Mongoose plugin to simplify building username and password login with Passport.
| passport-local | Passport strategy for authenticating with a username and password.
| multer | For uploading content
| moment | For calculating the time for uploaded video

The are some of the highlighting libraries along with their purposes.

__Express generator was used to create all the initial files that are required for any express app to work__

__ejs is used as the view engine__

__MongoDb is used as the database__

Now, let's move to some naming convention
There are four files in routes folder
1) index.js - which handles all the routes like post routes or get routes.
2) multer.js - This file is only for setting the multer for to upload content.
3) posts.js - This file is made for mongodb. It contains the schema for the videos.
3) users.js - This file is made for mongodb. It contains the schema for creators or users.

In routes, the user is refered to as the one who is using the app

In index.js, the userModel represents the user Schema and videoModel represents the video Schema

##CONCLUSION
Thank you soo much for checking out my project. I hope this will benefit you. If you have any questions, feel free to contact me.

__This project can be further developed by adding more features.__

__Contact Information__

email: zkhan52607@gmail.com