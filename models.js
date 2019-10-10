const mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
  Title : {type: String, required: true},
  Description : {type: String, required: true},
  Genre : {
    Name : String,
    Description : String
  },
  Director : {
    Name : String,
    Bio : String
  },
  ImagePath : String,
  Featured : Boolean
});

const bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  Username : {type: String, required: true},
  Password : {type: String, required: true},
  Email : {type: String, required: true},
  Birthday : Date,
  Favorites : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Movie'}]
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password); };
};

var Movie = mongoose.model('Movie', movieSchema);
var User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
