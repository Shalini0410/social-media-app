const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const postController = require("../controllers/postController");
const { likePost } = require("../controllers/postController");
const { addComment } = require("../controllers/postController");

router.put("/:id/comment", verifyToken, addComment);

router.put("/:id/like", verifyToken, likePost);
router.post("/", verifyToken, postController.createPost);
router.get("/timeline", verifyToken, postController.getTimelinePosts);
router.get("/", postController.getAllPosts);

module.exports = router;