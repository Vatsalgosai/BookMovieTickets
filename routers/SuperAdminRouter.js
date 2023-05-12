import express from "express";
import userController from "../controllers/UserController.js";
import isSuperAdmin from "../middleware/is-superAdmin.js";
import isAuth from "../middleware/is-auth.js";
import { body } from "express-validator";
import bodyParser from "body-parser";
const router = express.Router();

router.use(bodyParser.json());

router.post(
  "/signup-admin",
  [
    body("email").isEmail().withMessage("Please enter valid email"),

    body("name", "please enter valid name").isLength({ min: 3 }),
    body("contact", "please enter only 10 digites contact no.").isLength({
      min: 10,
      max: 10,
    }),

    body(
      "password",
      "please enter a password Only Alphanumeric and atleast 5 character"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  isAuth,
  isSuperAdmin,
  userController.createUser
);

router.put(
  "/update-admin/:id",
  isAuth,
  isSuperAdmin,
  userController.updateUser
);

router.get("/findusers", isAuth, isSuperAdmin, userController.getUsers);

router.delete(
  "/delete-admin/:id",
  isAuth,
  isSuperAdmin,
  userController.deleteUser
);

export default router;
