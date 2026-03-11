const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: String,
    content: String,
    image: String,

    likes: {
      type: Array,
      default: [],
    },

    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);