const express = require("express");
const router = express.Router();

const Task = require("./models/Task.model.js");
const User = require("../models/User.model.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

/* GET create task */

router.get("/create", isLoggedIn, (req, res, next) => {
  User.find()
    .then((usersFromDB) => {
      const data = {
        users: usersFromDB,
      };
      res.render("task/task-create", data);
    })
    .catch((e) => {
      console.log("Error getting list of users from DB", e);
      next(e);
    });
});

router.post("/create", isLoggedIn, (req, res, next) => {
  const { title, state, responsible, priority, category, description } =
    req.body;

  console.log(req.body);

  Task.create({ title, state, responsible, priority, category, description })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      console.log("Failed to create the task", e);
      next(e);
    });
});

module.exports = router;
