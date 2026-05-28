import { Filter } from "mongodb";
import { BaseRepository } from "./base.repository";

export interface User {
  _id?: any;
  email: string;
  name?: string;
  emailVerified?: Date;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email } as Filter<User>);
  }

  async findById(id: any): Promise<User | null> {
    return await this.findOne({ _id: id } as Filter<User>);
  }

  async getUserEmail(userId: any): Promise<string | null> {
    const user = await this.findById(userId);
    return user?.email || null;
  }
}
