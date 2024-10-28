import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export class UserModel {
  private users: User[] = [];

  public getAllUsers(): User[] {
    return this.users;
  }

  public getUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  public createUser(username: string, age: number, hobbies: string[]): User {
    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(
    userId: string,
    username: string,
    age: number,
    hobbies: string[]
  ): User | undefined {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      const updatedUser: User = {
        id: userId,
        username,
        age,
        hobbies,
      };
      this.users[userIndex] = updatedUser;
      return updatedUser;
    }
    return undefined;
  }

  public deleteUser(userId: string): boolean {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}
