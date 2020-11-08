import { Router, RouterContext } from "./deps.ts";
import authController from "./controllers/AuthController.ts";
import surveyController from "./controllers/SurveyController.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import questionController from "./controllers/QuestionController.ts";
import siteController from "./controllers/SiteController.ts";

const router = new Router();

router
  .get("/", siteController.surveys)
  .get("/survey/:id", siteController.viewSurvey)
  .post("/survey/:id", siteController.submitSurvey)

  //Authent
  .post("/api/login", authController.login)
  .post("/api/register", authController.register)

  .get(
    "/api/survey",
    authMiddleware,
    surveyController.getAllForUser.bind(surveyController)
  )
  .get(
    "/api/survey/:id",
    authMiddleware,
    surveyController.getSingle.bind(surveyController)
  )
  .post(
    "/api/survey",
    authMiddleware,
    surveyController.create.bind(surveyController)
  )
  .put(
    "/api/survey/:id",
    authMiddleware,
    surveyController.update.bind(surveyController)
  )
  .delete(
    "/api/survey/:id",
    authMiddleware,
    surveyController.delete.bind(surveyController)
  )

  //question
  .get(
    "/api/survey/:surveyId/questions",
    authMiddleware,
    questionController.getBySurvey.bind(questionController)
  )
  .get(
    "/api/question/:id",
    authMiddleware,
    questionController.getSingle.bind(questionController)
  )
  .post(
    "/api/question/:surveyId",
    authMiddleware,
    questionController.create.bind(questionController)
  )
  .put(
    "/api/question/:id",
    authMiddleware,
    questionController.update.bind(questionController)
  )
  .delete(
    "/api/question/:id",
    authMiddleware,
    questionController.delete.bind(questionController)
  );

export default router;
