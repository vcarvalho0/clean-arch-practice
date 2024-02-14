import { UsersRepository } from "@/repositories/user-repository";
import { Response, Request } from "express";
import { z } from "zod";

export class UserController {
  constructor(private userRepository: UsersRepository) {}

  public async create(req: Request, res: Response) {
    const userSchema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    });

    const { username, email, password } = userSchema.parse(req.body);

    const user = this.userRepository.create({
      username,
      email,
      password
    });

    return res.status(201).json(user);
  }
}
