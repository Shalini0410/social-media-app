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
    const { limit = 10, skip = 0 } = req.query;

    const posts = await Post.find()
      .populate("userId", "username email") // Fetch username and email from User model
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const formattedPosts = posts.map(post => ({
      ...post._doc,
      username: post.userId?.username || "Deleted User",
    }));

    res.json(formattedPosts);

  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post.likes.includes(req.user.id)) {
      await post.updateOne({ $push: { likes: req.user.id } });
      const updatedPost = await Post.findById(req.params.id).populate("userId", "username email");
      res.status(200).json({ message: "Post liked ❤️", likes: updatedPost.likes });
    } else {
      await post.updateOne({ $pull: { likes: req.user.id } });
      const updatedPost = await Post.findById(req.params.id).populate("userId", "username email");
      res.status(200).json({ message: "Post unliked 💔", likes: updatedPost.likes });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.addComment = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            userId: req.user.id,
            text: req.body.text,
          },
        },
      },
      { new: true }
    ).populate("comments.userId", "username");

    res.status(200).json({ message: "Comment added 💬", comments: updatedPost.comments });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// GET TIMELINE POSTS (Following only)
exports.getTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const { limit = 10, skip = 0 } = req.query;

    const posts = await Post.find({
      userId: { $in: currentUser.following }
    })
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const formattedPosts = posts.map(post => ({
      ...post._doc,
      username: post.userId?.username || "Deleted User",
    }));

    res.status(200).json(formattedPosts);
  } catch (err) {
    res.status(500).json(err);
  }
};