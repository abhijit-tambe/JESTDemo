const TodoModel = require("../model/todo.model");
exports.createTodo = async (req, res, next) => {
  try {
    const createModel = await TodoModel.create(req.body);
    res.status(201).json(createModel);
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    // console.log(allTodos);
    res.status(200).json(allTodos);
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  //   try {
  //     const todoModel = TodoModel.findById(req.params.todoId);
  //     if (todoModel) {
  //       res.status(200).json(todoModel);
  //     } else {
  //       res.status(404).send();
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  try {
    const todoModel = await TodoModel.findById(req.params.todoId);
    console.log(todoModel);
    if (todoModel) {
      res.status(200).json(todoModel);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// exports.updateTodo = async (req, res, next) => {
//   TodoModel.findByIdAndUpdate(req.params.todoId, req.body, {
//     new: true,
//     useFindAndModify: false,
//   });
// };

// exports.getTodos = async (req, res, next) => {
//   try {
//     const allTodos = await TodoModel.find({});
//     res.status(200).json(allTodos);
//   } catch (err) {
//     next(err);
//   }
// };

/*///todo.controller
const TodoModel = require('../model/todo.model')
exports.createTodo = async  (req, res, next) => {
   try{
    const createdModel = await TodoModel.create(req.body);
    res.status(201).json(createdModel);
   }
   catch(err){
        next(err);
   }
     
};

exports.getTodos = async(req, res, next)=>{

    try{
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    }
    catch(err){
        next(err);
    }
   
};
*/
