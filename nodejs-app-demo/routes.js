const express = require("express");
let todos = require("./todos");

const router = express.Router();

router.get("/todos", (req, res) => {
  res.json(todos);
});

router.post("/todos", (req, res) => {
  const { task } = req.body;
  
  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "Task is required" });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task: task.trim(),
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  
  todos.splice(index, 1);
  res.status(200).json({ message: "Todo deleted successfully" });
});

module.exports = router;
