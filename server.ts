import { Application, Router, RouterContext } from "./deps.ts";
import { staticFileMiddleware } from "./middlewares/staticFileMiddleware.ts";
import router from "./router.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFileMiddleware);
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on ${secure ? "https://" : "http://"} ${
      hostname || "localhost"
    }: ${port}`
  );
});

app.addEventListener("error", (e) => console.log("e", e.error));

await app.listen({ port: 8000 });
