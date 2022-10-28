const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [String],
    default: ["user"],
    enum: ["user", "editor", "admin"]
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
