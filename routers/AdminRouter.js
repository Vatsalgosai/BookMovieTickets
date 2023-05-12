import route from "express";
import adminController from "../controllers/AdminController.js";
import isAuth from "../middleware/is-auth.js";
import isAdmin from "../middleware/is-admin.js";

const router = route.Router();

router.post("/movie", isAuth, isAdmin, adminController.saveMovie);

router.get("/movies", isAuth, isAdmin, adminController.findAllMovie);

router.get("/movie/:id", isAuth, isAdmin, adminController.findById);

router.put("/movie/:id", isAuth, isAdmin, adminController.updateMovie);

router.delete("/movie/:id", isAuth, isAdmin, adminController.deleteMovie);

export default router;
