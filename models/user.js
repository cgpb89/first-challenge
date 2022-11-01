const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next){
    // Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
    // your application becomes.
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    // Replace the plain text password with the hash and then store it
    this.password = hash;
    // Indicates we're done and moves on to the next middleware
    next();
  });

  UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    // Hashes the password sent by the user for login and checks if the hashed password stored in the
    // database matches the one sent. Returns true if it does else false.
    const compare = await bcrypt.compare(password, user.password);
    return compare;
  }

UserSchema.methods.generateJWT = function () {
    return jwt.sign({ user: {
        _id: this._id,
        email: this.email
    }
    }, 'secret_token', {expiresIn: '2m'});
}

const User = mongoose.model('user', UserSchema);

module.exports = User