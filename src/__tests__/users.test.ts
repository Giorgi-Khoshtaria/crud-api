// src/__tests__/users.test.ts

import { Request, Response } from "express";
import * as userController from "../controllers/userController";

jest.mock("../controllers/userController"); // Mock the user controller

describe("User API", () => {
  let mockRequest: (body: any, params?: any) => Request;
  let mockResponse: () => Response;

  beforeEach(() => {
    mockRequest = (body: any, params?: any) =>
      ({
        body,
        params,
      } as Request);

    mockResponse = (): Response => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnThis(),
      };
      return res as Response; // Cast to Response
    };
  });

  it("should return an empty array when getting all users", async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    // Mock implementation to simulate the response for getAllUsers
    (userController.getAllUsers as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json([]);
    });

    await userController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should create a new user", async () => {
    const newUser = { username: "John", age: 30, hobbies: ["reading"] };
    const req = mockRequest(newUser, {});
    const res = mockResponse();

    // Mock implementation to simulate the response
    (userController.createUser as jest.Mock).mockImplementation((req, res) => {
      const createdUser = { id: "1", ...req.body }; // Mocked ID for the user
      res.status(201).json(createdUser);
    });

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });

  it("should get the created user by ID", async () => {
    const req = mockRequest({}, { userId: "1" });
    const res = mockResponse();
    const user = { id: "1", username: "John", age: 30, hobbies: ["reading"] };

    // Mock the response of getUserById
    (userController.getUserById as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json(user);
    });

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("should return 404 for a non-existing user", async () => {
    const req = mockRequest({}, { userId: "non-existing-id" });
    const res = mockResponse();

    (userController.getUserById as jest.Mock).mockImplementation((req, res) => {
      res.status(404).json({ message: "User not found" });
    });

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should update the created user", async () => {
    const updatedUser = {
      username: "John Doe",
      age: 31,
      hobbies: ["reading", "traveling"],
    };
    const req = mockRequest(updatedUser, { userId: "1" });
    const res = mockResponse();
    const user = { id: "1", ...updatedUser };

    (userController.updateUser as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json(user);
    });

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("should delete the created user", async () => {
    const req = mockRequest({}, { userId: "1" });
    const res = mockResponse();

    (userController.deleteUser as jest.Mock).mockImplementation((req, res) => {
      res.sendStatus(204);
    });

    await userController.deleteUser(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);

    // Verify that the user was deleted
    await userController.getUserById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});
