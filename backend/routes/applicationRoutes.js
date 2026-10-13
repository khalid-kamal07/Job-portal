const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/auth");
const c = require("../controllers/applicationController");
router.post("/job/:jobId", protect, allowRoles("candidate"), c.apply);
router.get("/mine", protect, allowRoles("candidate"), c.myApplications);
router.get(
  "/job/:jobId",
  protect,
  allowRoles("employer", "admin"),
  c.jobApplications,
);
router.patch(
  "/:id",
  protect,
  allowRoles("employer", "admin"),
  c.updateApplication,
);
router.get("/all", protect, allowRoles("admin"), c.allApplications);
module.exports = router;
