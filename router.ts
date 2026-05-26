import { Router } from "oak";

const router = new Router();

router
    .get("/prices", (context) => {
    context.response.body = "hello world";
});


export { router };