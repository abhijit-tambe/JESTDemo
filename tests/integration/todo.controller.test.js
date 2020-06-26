//supertest: test whole nodejs app
const newTodo = require("../mockData/new-todo.json");
const request = require("supertest");
const endPointUrl = "/todos/";
const app = require("../../app");
const { report } = require("../../app");
const { response } = require("express");
var constTodo;
// const { TestScheduler } = require("jest");

describe(endPointUrl, () => {
  // test("GET" + endPointUrl, async () => {
  //   const response = await request(app).get(endPointUrl);
  //   expect(response.statusCode).toBe(200);
  //   expect(Array.isArray(response.body)).toBeTruthy();
  //   expect(response.body[0].title).toBeDefined();
  //   expect(response.body[0].done).toBeDefined();
  // });
  test("GET" + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();

    firstTodo = response.body[0];
  });

  it("GET by id" + endPointUrl + ":todoId", async () => {
    const response = await request(app).get(endPointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it("GET Todo by id doesnt exist" + endPointUrl + ":todoId", async () => {
    const response = await request(app).get(
      endPointUrl + "5ef4d57fb7d5187ac4c20089"
    );
    expect(response.statusCode).toBe(404);
  });

  it("POST" + endPointUrl, async () => {
    const response = await request(app).post(endPointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  it(
    "should return error 500 on malformed data with Post" + endPointUrl,
    async function () {
      const response = await request(app)
        .post(endPointUrl)
        .send({ title: "Missing done property" });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );
});

/*
//todo.controller.int.test
//supertest: test whole nodejs app
const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");
const { response } = require("express");
const { report } = require("../../app");

const endpointUrl = "/todos/";


describe(endpointUrl, () => {
  test("GET"+endpointUrl, async ()=>{
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
  })

  it("POST" + endpointUrl, async () => {
    const response = await request(app)
        .post(endpointUrl)
        .send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  it("should return error 500 on malformed data with POST"+endpointUrl, async ()=>{
    const response = await request(app)
                            .post(endpointUrl)
                            .send({title:"Missing done property"});
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message:"Todo validation failed: done: Path `done` is required."
    });
  })
});*/
