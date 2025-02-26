import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Task } from "../src/Models/taskModel.js";

dotenv.config({ path: ".env.test" });

const token = process.env.TEST_AUTH_TOKEN;
const invalidToken = "Bearer invalidToken";
const fakeTaskId = new mongoose.Types.ObjectId(); // Random valid ID

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task API", () => {
  let taskId;

  /** ✅ Test Successful Task Creation */
  test("Should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "This is a test task",
        status: "pending",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task).toHaveProperty("_id");
    taskId = res.body.task._id;
  }, 10000);

  /** ✅ Test Validation Errors */
  test("Should return 400 when title is missing", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Missing title",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Title is required");
  });

  /** ✅ Test Unauthorized Requests */
  test("Should return 401 when no token is provided", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  test("Should return 403 when token is invalid", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", invalidToken);
    expect(res.statusCode).toBe(403);
  });

  /** ✅ Test Fetching All Tasks */
  test("Should fetch all tasks", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "All tasks retrieved successfully"
    );
    expect(Array.isArray(res.body.tasks)).toBeTruthy();
  });

  /** ✅ Test Fetching a Single Task */
  test("Should fetch a task by ID", async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task._id).toBe(taskId);
  });

  test("Should return 404 for non-existent task", async () => {
    const res = await request(app)
      .get(`/tasks/${fakeTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  test("Should return 400 for invalid task ID", async () => {
    const res = await request(app)
      .get("/tasks/invalidID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  /** ✅ Test Task Update */
  test("Should update a task", async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "in-progress" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("task");
    expect(res.body.task.status).toBe("in-progress");
  });

  test("Should return 404 when updating a non-existent task", async () => {
    const res = await request(app)
      .patch(`/tasks/${fakeTaskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "done" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  /** ✅ Test Task Deletion */
  test("Should delete a task", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });

  test("Should return 404 when deleting a non-existent task", async () => {
    const res = await request(app)
      .delete(`/tasks/${fakeTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  /** ✅ Simulate Database Error */
  test("Should return 500 when database fails", async () => {
    jest.spyOn(Task, "find").mockImplementation(() => {
      throw new Error("Database error");
    });

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");

    jest.restoreAllMocks();
  });
});
