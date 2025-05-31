import { handleYupError } from "@/utils/errorFormatter";
import schema from "./validate";
export const signupValidator = async (body) => {
  try {
    const data = await schema.validate(body, {
      abortEarly: false,
    });
    return data;
  } catch (error) {
    handleYupError(error);
  }
};
