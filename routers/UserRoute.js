import express from "express";
import userController from "../controllers/UserController.js";
import { body } from "express-validator";
import movieController from "../controllers/movieController.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.post(
  "/signup",
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
  userController.createUser
);

router.post(
  "/login",
  [body("email").isEmail().not().isEmpty(), body("password").notEmpty()],
  userController.logIn
);

router.get("/movies", isAuth, movieController.getMovies);

router.post(
  "/movie/bookticket/:movieId",
  isAuth,
  movieController.bookMovieTicket
);

router.post(
  "/movie/cancelticket/:ticketId",
  isAuth,
  movieController.cancelMovieTicket
);

router.get("/upcomingmovies", isAuth, movieController.getUpcomingMovies);
router.get(
  "/currenmovie/shortbyshows",
  isAuth,
  movieController.getCurrentMovieShortByShows
);
export default router;
