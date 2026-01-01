import User from "../user/user.model";

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email: email.toLowerCase() });
};

export const findUserByEmailWithPassword = async (email: string) => {
  return User.findOne({ email: email.toLowerCase() }).select("+password");
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) => {
  return User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: data.role ?? "user",
  });
};
