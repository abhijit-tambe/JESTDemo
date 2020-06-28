const express = require("express");
const todoRoutes = require("./routes/todo.routes");
const app = express();

const mongodb = require("./mongodb/mongodb.connection");
/*mongodb.connect();
app.use(express.json());
app.use("/todos", todoRoutes);
app.get("/", (req, res) => {
  res.json("hello");
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

app.listen(3000, () => {
  console.log("server started");
});

module.exports = app;*/
//app.js
// const express = require("express");
// const app = express();
// const todoRoutes = require("./routes/todo.routes");
// const mongodb = require("./mongodb/mongodb.connection");

mongodb.connect();

app.use(express.json());

// the order of app.use path does matter errors must be below the path its routing to
app.use("/todos", todoRoutes);
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});
app.get("/", (req, res) => {
  res.json("Hello from Express");
});

module.exports = app;
