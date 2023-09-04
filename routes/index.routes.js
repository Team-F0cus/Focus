const express = require("express");
const router = express.Router();

const Task = require("../models/Task.model.js");
const User = require("../models/User.model.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

/* GET home page */
router.get("/", (req, res, next) => {
  Task.find()
    .populate("responsible")
    .then((allTasksFromDB) => {
      res.render("index", { task: allTasksFromDB });
    })
    .catch((error) => {
      console.log("Error while getting the Tasks from the DB: ", error);

      next(error);
    });
});

module.exports = router;
