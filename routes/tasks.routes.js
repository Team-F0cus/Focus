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
    .then((theTask) => {
      let logged = false;
      if (req.session.currentUser) {
        logged = true;
      }
      const data = {
        task: theTask,
        logged: logged,
      };
      res.render("task/task-details.hbs", data);
    })
    .catch((error) => {
      console.log("Error while retrieving the task details: ", error);
      next(error);
    });
});

// GET CREATE A TASK
router.get("/create", isLoggedIn, (req, res, next) => {
  User.find()
    .then((usersFromDB) => {
      let logged = false;
      if (req.session.currentUser) {
        logged = true;
      }
      const data = {
        logged: logged,
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

  const priorityArr = Task.schema.path("priority").options.enum;
  const categoryArr = Task.schema.path("category").options.enum;
  const stateArr = Task.schema.path("state").options.enum;

  try {
    const taskDetails = await Task.findById(taskId).populate("responsible");
    const responsible = await User.find();

    const selectedPriority = priorityArr.map((element) => {
      if (element === taskDetails.priority) {
        return { priority: element, select: true };
      } else {
        return { priority: element, select: false };
      }
    });

    const selectedCategory = categoryArr.map((element) => {
      if (element === taskDetails.category) {
        return { category: element, select: true };
      } else {
        return { category: element, select: false };
      }
    });

    const selectedState = stateArr.map((element) => {
      if (element === taskDetails.state) {
        return { state: element, select: true };
      } else {
        return { state: element, select: false };
      }
    });

    const selectedResp = responsible.map((element) => {
      if (element.username === taskDetails.responsible.username) {
        return { responsible: element, select: true };
      } else {
        return { responsible: element, select: false };
      }
    });

    console.log(selectedResp);

    let logged = false;
    if (req.session.currentUser) {
      logged = true;
    }

    const data = {
      task: taskDetails,
      responsible,
      logged,
      selectedPriority,
      selectedCategory,
      selectedState,
      selectedResp,
    };

    res.render("task/task-edit.hbs", data);
  } catch (error) {
    next(error);
  }
});

// POST TASK UPDATE
router.post("/edit/:taskId", isLoggedIn, (req, res, next) => {
  const { taskId } = req.params;
  const { title, state, responsible, priority, category, description } =
    req.body;

  Task.findByIdAndUpdate(
    taskId,
    { title, state, responsible, priority, category, description },
    { new: true }
  )
    .then(() => res.redirect(`/`))
    .catch((error) => next(error));
});

// POST TO DELETE TASK
router.post("/delete/:taskId", isLoggedIn, (req, res, next) => {
  const { taskId } = req.params;

  Task.findByIdAndDelete(taskId)
    .then(() => res.redirect("/"))
    .catch((error) => next(error));
});

module.exports = router;
