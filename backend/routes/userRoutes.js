const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.put("/:id/follow", verifyToken, userController.followUser);
router.put("/:id/unfollow", verifyToken, userController.unfollowUser);
router.get("/:id", userController.getUser);
router.get("/search/find", userController.searchUsers);
router.get("/profile/me", verifyToken, userController.getMe);
router.put("/:id", verifyToken, userController.updateUser);

module.exports = router;
