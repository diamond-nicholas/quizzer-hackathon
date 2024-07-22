const express = require("express");
const authRoute = require("./auth.route");
const quizRoute = require("./quiz.route");

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
