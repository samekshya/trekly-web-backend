import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt";
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "./auth.repository";

export const registerUserService = async (input: {
  name: string;
  email: string;
  password: string;
}) => {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    return { ok: false as const, status: 409, message: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return {
    ok: true as const,
    status: 201,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUserService = async (input: {
  email: string;
  password: string;
}) => {
  const user = await findUserByEmailWithPassword(input.email);

  if (!user || !user.password) {
    return { ok: false as const, status: 401, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    return { ok: false as const, status: 401, message: "Invalid credentials" };
  }

  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    ok: true as const,
    status: 200,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
};
