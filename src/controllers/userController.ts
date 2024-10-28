import { Request, Response } from "express";
import { UserModel } from "../models/user";

const userModel = new UserModel();

export const getAllUsers = (req: Request, res: Response) => {
  const users = userModel.getAllUsers();
  res.status(200).json(users);
  console.log(users);
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = userModel.getUserById(userId);
  if (!userId) {
    res.status(400).json({ message: "Invalid userId format" });
  }
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  console.log(user);
  res.status(200).json(user);
};

export const createUser = (req: Request, res: Response) => {
  const { username, age, hobbies } = req.body;
  if (!username || !age || !hobbies) {
    res.status(400).json({ message: "Required fields are missing" });
  }
  const newUser = userModel.createUser(username, age, hobbies);
  res.status(201).json(newUser);
  console.log(newUser);
};

export const updateUser = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { username, age, hobbies } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Invalid userId format" });
  }

  const updatedUser = userModel.updateUser(userId, username, age, hobbies);
  if (!updatedUser) {
    res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(updatedUser);
  console.log(updatedUser);
};

export const deleteUser = (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    res.status(400).json({ message: "Invalid userId format" });
  }

  const deleted = userModel.deleteUser(userId);
  if (!deleted) {
    res.status(404).json({ message: "User not found" });
  }
  console.log(deleteUser);
  res.status(204).send();
};
