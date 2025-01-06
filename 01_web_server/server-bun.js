import { serve } from "bun";
import { request } from "http";

const port = 3000;
const hostname = "127.0.0.1";

serve({
  port: port,
  hostname: hostname,
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello World!", { status: 200 });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
});
