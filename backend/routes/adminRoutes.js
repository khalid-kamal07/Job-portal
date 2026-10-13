const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/auth");
const c = require("../controllers/adminController");
router.use(protect, allowRoles("admin"));
router.get("/dashboard", c.dashboard);
router.get("/users", c.users);
router.patch("/users/:id/role", c.updateUserRole);
router.delete("/users/:id", c.deleteUser);
module.exports = router;
