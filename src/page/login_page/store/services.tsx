import { loginUser } from "../../../database";

export const Login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // "admin@example.com"
  // "admin123")
  try {
    const user = await loginUser(email, password);
    return user;
  } catch (error) {
    return error;
  }
};
