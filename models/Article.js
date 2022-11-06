const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  tags: [String],
  author: { type: String, required: true },
  state: { type: String, default: "draft", enum: ["draft", "published"] },
  read_count: { type: Number, default: 0 },
  reading_time: Number,
  body: { type: String, required: true },
},
{timestamps: true},

);

module.exports = mongoose.model("Article", articleSchema);
