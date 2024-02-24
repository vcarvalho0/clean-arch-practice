import { UsersRepository } from "@/repositories/user-repository";
import HashService from "@/services/hash";
import JwtService from "@/services/jwt";
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

  public async authenticate(req: Request, res: Response) {
    const authenticateSchema = z.object({
      email: z.string().email(),
      password: z.string()
    });

    const { email, password } = authenticateSchema.parse(req.body);

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return this.customErrorResponse(res, {
        code: 401,
        message: "User not found"
      });
    }

    if (!(await HashService.comparePassword(password, user.password))) {
      return this.customErrorResponse(res, {
        code: 401,
        message: "Email or password doesn't exist"
      });
    }

    const token = JwtService.generateToken(user.id);

    return res.status(200).json({ ...user, token });
  }

  public async me(req: Request, res: Response) {
    const { user: id } = req.headers;

    const findUser = await this.usersRepository.findById(id as string);

    if (!findUser) {
      return this.customErrorResponse(res, {
        code: 404,
        message: "User not found"
      });
    }

    return res.status(200).json(findUser);
  }
}
