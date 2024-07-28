const express = require("express");
const authRoute = require("./auth.route");
const quizRoute = require("./quiz.route");
const questionRoute = require("./question.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/quiz",
    route: quizRoute,
  },
  {
    path: "/question",
    route: questionRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
