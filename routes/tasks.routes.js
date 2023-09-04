const express = require("express");
const router = express.Router();

const Task = require("../models/Task.model.js");
const User = require("../models/User.model.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

// GET DETAILLED VIEW
router.get("/details/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  Task.findById(taskId)
    .populate("responsible")
    .then((theTask) => res.render("task/task-details.hbs", { task: theTask }))
    .catch((error) => {
      console.log("Error while retrieving the task details: ", error);
      next(error);
    });
});

// GET CREATE A TASK
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

// POST CREATE A TASK
router.post("/create", isLoggedIn, (req, res, next) => {
  const { title, state, responsible, priority, category, description } =
    req.body;

  Task.create({ title, state, responsible, priority, category, description })
    .then(() => {
      res.redirect("/");
    })
    .catch((e) => {
      console.log("Failed to create the task", e);
      next(e);
    });
});

// GET TASK UPDATE
router.get("/edit/:taskId", isLoggedIn, async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const taskDetails = await Task.findById(taskId);
    const responsible = await User.find();

    const data = {
      task: taskDetails,
      responsible: responsible,
    };

    res.render("task/task-edit.hbs", data);
  } catch (error) {
    next(error);
  }
});

// POST TO DELETE TASK
router.post('/delete/:taskId', isLoggedIn,(req, res, next) => {
  const { taskId } = req.params;
  
  Task.findByIdAndDelete(taskId)
    .then(() => res.redirect('/'))
    .catch(error => next(error));
});

module.exports = router;
