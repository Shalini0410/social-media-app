const Post = require("../models/Post");
const User = require("../models/User");
// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id, // from JWT
      content: req.body.content,
      image: req.body.image
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    const postsWithUser = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.userId);
        return {
          ...post._doc,
          username: user.username,
        };
      })
    );

    res.json(postsWithUser);

  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.status(200).json("Post liked ❤️");
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.status(200).json("Post unliked 💔");
    }

  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    await post.updateOne({
      $push: {
        comments: {
          userId: req.user.id,
          text: req.body.text,
        },
      },
    });

    res.status(200).json("Comment added 💬");

  } catch (err) {
    res.status(500).json(err.message);
  }
};