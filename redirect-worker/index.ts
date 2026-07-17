export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    url.hostname = "timmo.dev";
    return Response.redirect(url, 308);
  },
};
