export default {
  async fetch(request, env, ctx) {
    return new Response("YNS test worker OK - " + new URL(request.url).pathname, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }
};
