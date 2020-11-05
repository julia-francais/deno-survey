import { Context } from "../deps.ts";

export const staticFileMiddleware = async (ctx: Context, next: Function) => {
    console.log("static");

    const path = `${Deno.cwd()}/assets${ctx.request.url.pathname}`;
    console.log(path);
    await next();

}