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

      // Call the error-middleware to display the error page to the user
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

router.post('/task/:taskId/delete', isLoggedIn,(req, res, next) => {
  const { taskId } = req.params;
 
  Task.findByIdAndDelete(taskId)
    .then(() => res.redirect('/'))
    .catch(error => next(error));
});
module.exports = router;
