import { RouterContext } from "../deps.ts";

class AuthController {
  login() {}
  async register(ctx: RouterContext) {
    const result = ctx.request.body();
    if (result.type === "json") {
      const { name, email, password } = await result.value;
      console.log(name, email, password);
    }
  }
}

const authController = new AuthController();
export default authController;
