import { RouterContext } from "../deps.ts";
import Question, { QuestionType } from "../models/Question.ts";
import Survey from "../models/Survey.ts";
import User from "../models/User.ts";
import BaseSurveyController from "./BaseSurveyController.ts";

class QuestionController extends BaseSurveyController {
  async getBySurvey(ctx: RouterContext) {
    const surveyId: string = ctx.params.surveyId!;

    const survey = await this.findSurveyOrFail(surveyId, ctx);
    if (survey) {
      const questions = await Question.findBySurvey(surveyId);
      ctx.response.body = questions;
    }
  }

  async getSingle(ctx: RouterContext) {
    const id: string = ctx.params.id!;

    const question = await Question.findById(id);
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid question id" };
      return;
    }
    const result = ctx.request.body();
    if (result.type === "json") {
      ctx.response.body = question;
    }
  }

  async create(ctx: RouterContext) {
    const surveyId: string = ctx.params.surveyId!;
    const result = ctx.request.body();
    if (result.type === "json") {
      const { text, type, required, data } = await result.value;
      const survey = await this.findSurveyOrFail(surveyId, ctx);
      if (survey) {
        const question = new Question(surveyId, text, type, required, data);
        await question.create();
        ctx.response.status = 201;
        ctx.response.body = question;
      }
    }
  }

  async update(ctx: RouterContext) {
    const id: string = ctx.params.id!;

    const question = await Question.findById(id);
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid question id" };
      return;
    }
    const result = ctx.request.body();
    if (result.type === "json") {
      const { text, type, required, data } = await result.value;
      await question.update(text, type, required, data);
      ctx.response.body = question;
    }
  }

  async delete(ctx: RouterContext) {
    const id: string = ctx.params.id!;

    const question = await Question.findById(id);
    if (!question) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Invalid question id" };
      return;
    }
    await question.delete();
    ctx.response.status = 204;
  }
}

const questionController = new QuestionController();
export default questionController;
