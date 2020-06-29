const TodoController = require("../../controllers/todo.controller");
const httpMocks = require("node-mocks-http");
const TodoModel = require("../../model/todo.model");
const newTodo = require("../mockData/new-todo.json");
const allTodos = require("../mockData/all-todos.json");
const { TestScheduler } = require("jest");
const { findById, findByIdAndUpdate } = require("../../model/todo.model");
const { request } = require("../../app");

// mocking with jest function
// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();
// TodoModel.findById = jest.fn();
// TodoModel.findByIdAndUpdate = jest.fn();
// TodoModel.findByIdAndDelete = jest.fn();

jest.mock("../../model/todo.model");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

//test for deletebyId
describe("TodoController.deleteById", () => {
  it("should have a delete function", async () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });
  it("should call findByIdAndDelete", async () => {
    const todoId = "5ef7c66d77d76708f804d6a1";
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    // TodoModel.findByIdAndDelete.mockReturnValue();
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
  });

  it("should return status 200 and deleted todoModel", async () => {
    const todoId = "5ef7c30c4169b195b48ed5bb";
    req.params.todoId = todoId;
    await TodoController.deleteTodo(req, res, next);
    // TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
    expect(res.statusCode).toBe(200);
    // expect(res._getJSONData()).toStrictEqual(newTodo);
    // expect(res._isEndCalled()).toBeTruthy();
  });
});

//test for update todoby id
describe("TodoController.updateTodo", () => {
  it("should have a update function", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });
  var todoId = "5ef7c28960f09a9590cd0ae5";
  it("should update with TodoModel.findByIdAndUpdate", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindandModify: false,
    });
  });

  it("should return a response code with json data and status code 200", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "error finding TodoModel" };
    const errorPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(errorPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return status 404 when todo does not exist", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

//test for get todo by id
describe("TodoController.getTodoById", () => {
  test("is a function", async () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });
  it("findbyid is called", async () => {
    req.params.todoId = "5ef7c66d77d76708f804d6a1";
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toHaveBeenCalledWith("5ef7c66d77d76708f804d6a1");
  });

  it("should return status code 200 and json body", async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "error finding TodoModel" };
    const errorPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(errorPromise);
    await TodoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
  it("should return status 404 when todo does not exist", async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

//test suit for get todos
describe("TodoController.getTodos", () => {
  it("is a function", async () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });

  it("should get all the todos", async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toBeCalledWith({});
  });

  it("should return 200 status code ", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    // console.log(res.body);
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
  it("should handle errors", async () => {
    errorMessage = { message: "no todos found" };
    errorPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(errorPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

//test suit for create todo
describe("TodoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  //it spec testcase
  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });

  it("should call TodoModel.create", async () => {
    await TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("should return 201 response code", async () => {
    await TodoController.createTodo(req, res, next);
    //ensuring that response has been sent
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body", async () => {
    TodoModel.create.mockReturnValue(newTodo);
    // console.log(`req+ ${JSON.stringify(req.body)}`);
    await TodoController.createTodo(req, res, next);
    // console.log(newTodo);

    // using node mocks http module
    expect(res._getJSONData()).toStrictEqual(newTodo);
    // console.log(res.body);
  });
  it("should handle errors ", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectPromise = Promise.reject(errorMessage);
    // mocking jest with rejected promise
    TodoModel.create.mockReturnValue(rejectPromise);
    // calling the function which jest will reject
    await TodoController.createTodo(req, res, next);
    //testing the called function next has the error message object
    expect(next).toBeCalledWith(errorMessage);
  });
});

// describe("TodoController.updateTodo", () => {
//   it("should have a update function", () => {
//     expect(typeof TodoController.updateTodo).toBe("function");
//   });
//   todoId = "5ef4d57fb7d5187ac4c20889";
//   it("should update with TodoModel.findByIdandUpdate", async () => {
//     req.params.todoId = todoId;
//     req.body = newTodo;

//     await TodoController.updateTodo(req, res, next);
//     expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
//       new: true,
//       useFindandModify: false,
//     });
//   });

//   if (
//     ("should return a response code with json data and status code 200",
//     async () => {
//       req.params.todoId = todoId;
//       req.body = newTodo;
//       TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
//       await TodoController.updateTodo(req, res, next);
//       expect(response.statusCode).toBe(200);
//       expect(res._isEndCalled()).toBeTruthy();
//       expect(res._getJSONData()).toStrictEqual(newTodo);
//     })
//   );
// });

// describe("TodoController.getTodoById", () => {
//   it("should have a getTodoById", () => {
//     expect(typeof TodoController.getTodoById).toBe("function");
//   });

//   it("should call TodoModel.findById with the route paramerters", async () => {
//     expect(TodoModel.findById).toHaveBeenCalledWith("5ef4d57fb7d5187ac4c20889");
//   });

//   it("should return json body and response code 200", async () => {
//     TodoModel.findById.mockReturnValue(newTodo);
//     await TodoController.getTodoById(req, res, next);
//     expect(res.statusCode).toBe(200);
//     expect(res._getJSONData()).toStrictEqual(newTodo);
//     expect(res._isEndCalled()).toBeTruthy();
//   });

//   it("should do error handling", async () => {
//     const errorMessage = { message: "error finding todoModel" };
//     const rejectedPromise = Promise.reject(errorMessage);
//     TodoModel.findById.mockReturnValue(rejectedPromise);
//     await TodoController.getTodoById(req, res, next);
//     expect(next).toHaveBeenCalledWith(errorMessage);
//   });

//   it("should return 404 when item doesnt exist", async () => {
//     TodoModel.findById.mockReturnValue(null);
//     await TodoController.getTodoById(req, res, next);
//     expect(response.statusCode).toBe(404);
//     expect(res._isEndCalled()).toBeTruthy();
//   });
// });
// describe("TodoController.getTodos", () => {
//   it("should have a getTodos function", () => {
//     expect(typeof TodoController.getTodos).toBe("function");
//   });
//   it("should call TodoModel.find({})", async () => {
//     await TodoController.getTodos(req, res, next);
//     expect(TodoModel.find).toHaveBeenCalledWith({});
//   });
//   it("should return response with status 200 and all todos", async () => {
//     TodoModel.find.mockReturnValue(allTodos);
//     await TodoController.getTodos(req, res, next);
//     expect(res.statusCode).toBe(200);
//     expect(res._isEndCalled()).toBeTruthy();
//     expect(res._getJSONData()).toStrictEqual(allTodos);
//   });
//   it("should handle errors in getTodos", async () => {
//     const errorMessage = { message: "Error finding" };
//     const rejectedPromise = Promise.reject(errorMessage);
//     TodoModel.find.mockReturnValue(rejectedPromise);

//     await TodoController.getTodos(req, res, next);
//     expect(next).toHaveBeenCalledWith(errorMessage);
//   });
// });

// //test suite
// describe("TodoController.createTodo", () => {
// beforeEach(() => {
//   req.body = newTodo;
// });
// it("should have a createTodo", () => {
//   expect(typeof TodoController.createTodo).toBe("function");
// });
//   it("should call TodoModel.create", () => {
//     TodoController.createTodo(req, res, next);
//     expect(TodoModel.create).toBeCalledWith(newTodo);
//   });
//   it("should return 201 response code", async () => {
//     await TodoController.createTodo(req, res, next);
//     expect(res.statusCode).toBe(201);
//     //ensure that the response has been sent
//     expect(res._isEndCalled()).toBeTruthy();
//   });
//   it("should return json body response", async () => {
//     TodoModel.create.mockReturnValue(newTodo);
//     await TodoController.createTodo(req, res, next);
//     //_getJSONData:from node mocks http module
//     expect(res._getJSONData()).toStrictEqual(newTodo);
//   });
//   it("should handle errors", async () => {
//     const errorMessage = { message: "Done property missing" };
//     const rejectedPromise = Promise.reject(errorMessage);

//     TodoModel.create.mockReturnValue(rejectedPromise);
//     await TodoController.createTodo(req, res, next);
//     expect(next).toBeCalledWith(errorMessage);
//   });
// });
// // TodoModel.create = jest.fn();
// // TodoModel.find = jest.fn();

// // let req, res, next;
// // beforeEach(() => {
// //   req = httpMocks.createRequest();
// //   res = httpMocks.createResponse();
// //   next = jest.fn();
// // });

// // //test suite
// // describe("TodoController.createTodo", () => {
// //   beforeEach(() => {
// //     req.body = newTodo;
// //   });
// //   it("should have a createTodo", () => {
// //     expect(typeof TodoController.createTodo).toBe("function");
// //   });
// //   it("should call TodoModel.create", () => {
// //     TodoController.createTodo(req, res, next);
// //     expect(TodoModel.create).toBeCalledWith(newTodo);
// //   });
// //   it("should return 201 response code", async () => {
// //     await TodoController.createTodo(req, res, next);
// //     expect(res.statusCode).toBe(201);
// //     //ensure that the response has been sent
// //     expect(res._isEndCalled()).toBeTruthy();
// //   });
// //   it("should return json body response", async () => {
// //     TodoModel.create.mockReturnValue(newTodo);
// //     await TodoController.createTodo(req, res, next);
// //     //_getJSONData:from node mocks http module
// //     expect(res._getJSONData()).toStrictEqual(newTodo);
// //   });
// //   it("", async () => {
// //     const errorMessage = { message: "done property missing" };
// //     const rejectPromise = Promise.reject(errorMessage);
// //     TodoModel.create.mockReturnValue(rejectPromise);
// //     await TodoController.createTodo(req, res, next);
// //     expect(next).toBeCalledWith(errorMessage);
// //   });
// // });

// // describe("TodoController get by id", () => {
// //   it("should have a getTodoById", () => {
// //     expect(typeof TodoController.getTodoById).toBe("function");
// //   });
// // });

// // describe("TodoController.getTodos", () => {
// //   it("should have a getTodos function", () => {
// //     expect(typeof TodoController.getTodos).toBe("function");
// //   });
// //   it("should calll TodoModel.find()", async () => {
// //     await TodoController.getTodos(req, res, next);
// //     expect(TodoModel.find).toHaveBeenCalledWith({});
// //   });
// //   it("should return response with status 200 all todos", async () => {
// //     TodoModel.find.mockReturnValue(allTodos);
// //     await TodoController.getTodos(req, res, next);
// //     expect(res.statusCode).toBe(200);
// //     expect(res._isEndCalled()).toBeTruthy();
// //     expect(res._getJSONData()).toStrictEqual(allTodos);
// //   });
// //   it("should handle errors in get Todos", async () => {
// //     const errorMessage = { message: "Error finding" };
// //     const rejectedPromise = Promise.reject(errorMessage);
// //     TodoModel.find.mockReturnValue(rejectedPromise);
// //     await TodoController.getTodos(req, res, next);
// //     expect(next).toHaveBeenCalledWith(errorMessage);
// //   });
// // });

// /*//todo.controller.test

// const TodoController = require('../../controllers/todo.controller');
// const TodoModel = require("../../model/todo.model");
// const httpMocks = require('node-mocks-http')
// const newTodo = require('../mock-data/new-todo.json')
// const allTodos = require('../mock-data/all-todos.json');

// TodoModel.create = jest.fn();
// TodoModel.find = jest.fn();

// let req, res, next;
// beforeEach(()=>{
//     req = httpMocks.createRequest();
//     res = httpMocks.createResponse();
//     next = jest.fn();
// });

// describe("TodoController.getTodoById", ()=>{
//     it("should have a getTodoById", () => {
//         expect(typeof TodoController.getTodoById).toBe("function");
//     })
// })
// describe("TodoController.getTodos",()=>{
//     it("should have a getTodos function", ()=>{
//         expect(typeof TodoController.getTodos).toBe("function");
//     });
//     it("should call TodoModel.find({})", async  () =>{
//         await TodoController.getTodos(req, res, next);
//         expect(TodoModel.find).toHaveBeenCalledWith({});
//     });
//     it("should return response with status 200 and all todos", async()=>{
//         TodoModel.find.mockReturnValue(allTodos);
//         await TodoController.getTodos(req, res, next);
//         expect(res.statusCode).toBe(200);
//         expect(res._isEndCalled()).toBeTruthy();
//         expect(res._getJSONData()).toStrictEqual(allTodos);
//     });
//     it("should handle errors in getTodos", async()=>{
//         const errorMessage = {message:"Error finding"};
//         const rejectedPromise = Promise.reject(errorMessage);
//         TodoModel.find.mockReturnValue(rejectedPromise);

//         await TodoController.getTodos(req, res, next);
//         expect(next).toHaveBeenCalledWith(errorMessage);
//     })

// });

// //test suite
// describe("TodoController.createTodo", ()=>{

//     beforeEach(()=>{
//         req.body = newTodo;
//     })
//     it('should have a createTodo', ()=>{
//         expect(typeof TodoController.createTodo).toBe("function");
//     });
//     it("should call TodoModel.create", ()=>{
//         TodoController.createTodo(req, res, next);
//         expect(TodoModel.create).toBeCalledWith(newTodo);
//     })
//     it("should return 201 response code",async ()=>{
//         await TodoController.createTodo(req, res, next);
//         expect(res.statusCode).toBe(201);
//         //ensure that the response has been sent
//         expect(res._isEndCalled()).toBeTruthy();
//     })
//     it('should return json body response',async () => {
//         TodoModel.create.mockReturnValue(newTodo);
//         await TodoController.createTodo(req, res, next);
//         //_getJSONData:from node mocks http module
//         expect(res._getJSONData()).toStrictEqual(newTodo);
//     });
//     it("should handle errors", async () => {
//         const errorMessage = {message:"Done property missing"};
//         const rejectedPromise = Promise.reject(errorMessage);

//         TodoModel.create.mockReturnValue(rejectedPromise);
//         await TodoController.createTodo(req, res, next);
//         expect(next).toBeCalledWith(errorMessage);

//     })

// });
// */
