import { RouterContext } from "https://deno.land/x/oak@v6.3.1/router.ts";
import Survey from "../models/Survey.ts";
import User from "../models/User.ts";
import { surveysCollection } from "../mongo.ts";

export default class BaseSurveyController {
  async findSurveyOrFail(
    id: string,
    ctx: RouterContext
  ): Promise<Survey | null> {
    const survey = await Survey.findById(id);
    if (!survey) {
      ctx.response.status = 404;
      ctx.response.body = "Incorrect Id";
      return null;
    }

    //@TODO survey belongs to authorised user ?
    const user = ctx.state.user as User;
    if (survey.userId !== user.id) {
      ctx.response.status = 403;
      ctx.response.body = { message: "You don't have permission to do this" };
    }
    return null;
  }
}
