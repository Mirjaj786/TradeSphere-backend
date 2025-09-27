const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { userSchema } = require("../schema/usersSchema");

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameLowerCase: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
