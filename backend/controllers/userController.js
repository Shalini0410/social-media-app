const User = require("../models/User");

// FOLLOW USER
exports.followUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow.followers.includes(req.user.id)) {
        await userToFollow.updateOne({ $push: { followers: req.user.id } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User followed Successfully");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
};

// UNFOLLOW USER
exports.unfollowUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (userToUnfollow.followers.includes(req.user.id)) {
        await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User unfollowed successfully");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
};

// GET USER PROFILE
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can only update your own profile");
  }
};
// SEARCH USERS
exports.searchUsers = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json("Search query required");
  
  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).limit(10).select("username profilePicture bio");
    
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};
// GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
