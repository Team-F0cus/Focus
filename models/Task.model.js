const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title required"],
  },
  description: String,
  state: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo",
  },
  responsible: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  category: {
    type: String,
    enum: ["Bug", "Improvement", "Feature"],
  },
});
const Task = model("Task", taskSchema);

module.exports = Task;
