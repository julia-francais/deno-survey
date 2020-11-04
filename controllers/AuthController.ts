import { RouterContext, hashSync, compareSync, create } from "../deps.ts";
import User from "../models/User.ts";
import { usersCollection } from "../mongo.ts";

// const payload = await verify(jwt, "secret", "HS512"); // { foo: "bar" }

class AuthController {
  async login(ctx: RouterContext) {
    const result = ctx.request.body();
    if (result.type === "json") {
      const { email, password } = await result.value;
      if (!email || !password) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Please provide email and password" };
        return;
      }
      let _user: any = await User.findOne({ email });
      if (!_user) {
        ctx.response.status = 422;
        ctx.response.body = { message: "User doesn't exist" };
        return;
      }
      console.log("_user", _user);
      if (!compareSync(password, _user.password)) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Incorrect password" };
        return;
      }

      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        {
          iss: _user.email,
          exp: Date.now() / 1000 + 60 * 60,
        },
        "secret"
      );

      ctx.response.body = {
        id: _user.id,
        name: _user.name,
        email: _user.email,
      };
    }
  }

  async register(ctx: RouterContext) {
    const result = ctx.request.body();
    if (result.type === "json") {
      const { name, email, password } = await result.value;

      let _user = await User.findOne({ email });
      if (_user) {
        ctx.response.status = 422;
        ctx.response.body = { message: "Email is already used" };
        return;
      }
      const hashedPassword = hashSync(password);
      let user = new User({ name, email, password: hashedPassword });
      await user.save();
      ctx.response.status = 201;
      ctx.response.body = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
  }
}

const authController = new AuthController();
export default authController;
