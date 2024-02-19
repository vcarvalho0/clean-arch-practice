import { UsersRepository } from "@/repositories/user-repository";
import HashService from "@/services/hash";
import { Response, Request } from "express";
import { z } from "zod";
import { BaseController } from ".";

export class UserController extends BaseController {
  constructor(private usersRepository: UsersRepository) {
    super();
  }

  public async create(req: Request, res: Response) {
    const userSchema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    });

    const { username, email, password } = userSchema.parse(req.body);

    const hash = await HashService.hashPassword(password);

    try {
      const user = await this.usersRepository.create({
        username,
        email,
        password: hash
      });

      res.status(201).json(user);
    } catch (error) {
      this.sendCreateErrorResponse(res, error);
    }
  }
}
