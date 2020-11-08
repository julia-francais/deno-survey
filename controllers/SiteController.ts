//@ts-ignore
import Survey from "../models/Survey.ts";
import {RouterContext, renderFileToString} from "../deps.ts"
import { renderView } from "../helpers.ts";
import Question from "../models/Question.ts";
import {answersCollection} from '../mongo.ts';

class SiteController {
async surveys(ctx: RouterContext){
    const surveys = await Survey.findAll();  
    ctx.response.body = await renderView(`surveys`, {surveys});
}
async viewSurvey(ctx: RouterContext){
    const id:string = ctx.params.id!;
    const survey = await Survey.findById(id)
    if(!survey){
        ctx.response.body = await renderView(`notfound`);
        return;
    }
    const questions = await Question.findBySurvey(id);
    ctx.response.body = await renderView(`survey`, {survey, questions, answers: {}, errors: {}});
}

async submitSurvey(ctx: RouterContext) {
    const id:string = ctx.params.id!;
    const survey = await Survey.findById(id)
    if(!survey){
        ctx.response.body = await renderView(`notfound`);
        return;
    }

    const {value} = ctx.request.body({type: "form"});    
    const formData = await value;
    const errors: any = {};
    const answers: any = {};
    const questions = await Question.findBySurvey(id);
    for (const question of questions) {
        let value: any = formData.get(question.id);
        if(question.isChoice() && question.data.multiple) {
            value = formData.getAll(question.id)
        }

        if (question.required) {
            if(!value || (question.isChoice() && question.data.multiple && !value.length)) {
                errors[question.id] = "This field is required"
            }
        }

            answers[question.id] = value;
        }
        console.log('errors', errors);
        if (Object.keys(errors).length > 0) {
            ctx.response.body = await renderView('survey', {survey, questions, errors, answers});
            return;
        } 
        const {$oid} = await answersCollection.insertOne({
            surveyId: id,
            date: new Date(),
            userAgent: ctx.request.headers.get('User-Agent'),
            answers
        });
        ctx.response.body = await renderView('surveyFinish', {answerId: $oid})
    }
}

const siteController = new SiteController();
export default siteController;