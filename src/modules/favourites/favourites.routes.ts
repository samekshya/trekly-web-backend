import { Router } from "express";
import {
  addFavourite,
  getFavourites,
  removeFavourite,
  checkFavourite,
} from "./favourites.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

// All favourites routes require login
router.post("/", requireAuth, addFavourite);
router.get("/", requireAuth, getFavourites);
router.delete("/:trekId", requireAuth, removeFavourite);
router.get("/check/:trekId", requireAuth, checkFavourite);

export default router;