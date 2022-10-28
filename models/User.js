const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    User: {
      type: Number,
      default: 0938,
    },
    enum: [
      {
        Editor: {
          type: Number,
        },
        Admin: {
          type: Number,
        },
      },
    ],
  },
  refreshToken: String
});

module.exports = mongoose.model("User", userSchema);
