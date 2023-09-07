const express = require("express");
const router = express.Router();

const Task = require("../models/Task.model.js");
const User = require("../models/User.model.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

// GET home page
router.get("/", async (req, res, next) => {
  try {
    const todoTasks = await Task.find({ state: "Todo" }).populate(
      "responsible"
    );
    const inProgressTasks = await Task.find({ state: "In Progress" }).populate(
      "responsible"
    );
    const doneTasks = await Task.find({ state: "Done" }).populate(
      "responsible"
    );
    let logged = false 
      if(req.session.currentUser){
        logged = true
      }
  
    
  
    const data = {
      todoTasks: todoTasks,
      inProgressTasks: inProgressTasks,
      doneTasks: doneTasks,
      logged : logged,
    };


    res.render("index", data);
  } catch (error) {
    console.log("Error while getting the Tasks from the DB: ", error);
    next(error);
  }
});

/*// GET home page
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
});*/

module.exports = router;
