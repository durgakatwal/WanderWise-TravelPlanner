import { Router } from "express";
import {
  create,
  getUsers,
  findById,
  update,
  remove,
  getProfile,
  updateProfile,
  updateAvatar,
} from "../services/user.js";
import {
  createUserValidator,
  updateAvatarValidator,
  updateProfileValidator,
} from "../validators/validateUser.js";
import { useValidator } from "../middlewares/useValidator.js";

const router = Router();

router.post("/", useValidator(createUserValidator), create); // POST /users
router.get("/", getUsers); // GET /users

router.get("/profile", getProfile);
router.patch("/profile", useValidator(updateProfileValidator), updateProfile);
router.post(
  "/profile/avatar",
  useValidator(updateAvatarValidator),
  updateAvatar
);

router.get("/:id", findById);
router.patch("/:id", update);
router.delete("/:id", remove);
export default router;
