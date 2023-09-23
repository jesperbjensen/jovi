import { renderToString } from "react-dom/server";

type Handler = (url: URL, req: Request) => Response | Promise<Response>;

// A handler that lazy imports a React component from /components that match the url and renders the component and return the result
export type PageProps = {
  searchParams: Record<string, string>;
  formParams: Record<string, string>;
  setCookie: (name: string, value: string) => void;
  cookies: Record<string, string>;
};

const ReactHandler: Handler = async (url, req) => {
  let name = url.pathname;
  if (name == "/") {
    name = "/index";
  }

  const headers: HeadersInit = {
    "content-type": "text/html",
  };

  const module = await import(`./pages${name}.tsx`);

  const props = {
    searchParams: Object.fromEntries(url.searchParams.entries()),
    formParams: Object.fromEntries(
      new URLSearchParams(await req.text()).entries()
    ),
    setCookie(name: string, value: string) {
      headers["set-cookie"] = `${name}=${value}; HttpOnly; Path=/`;
    },
    cookies: Object.fromEntries(
      (req.headers.get("cookie") ?? "").split("; ").map((cookie) => {
        const [name, value] = cookie.split("=");
        return [name, value];
      })
    ),
  };

  const Component = await Promise.resolve(module.default(props));

  const html = renderToString(Component);

  return new Response(html, {
    headers,
  });
};

const handlers: Record<string, Handler> = {
  "": ReactHandler,
};

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    let url = req.url;

    let uri = new URL(url, `http://${req.headers.get("host")}`);

    let path = uri.pathname;

    const a = path.split(".")[1];
    const handler = handlers[a ?? ""];
    if (handler) {
      return handler(uri, req);
    }

    if (path === "/") {
      path = "/index";
    }

    // Check if the file exists in the public folder
    // If it doesn't, return a 404
    const file = Bun.file(`./public${path}`);

    if (!file.exists()) {
      return new Response(`<h1>404 - File not found</h1>`, {
        headers: { "content-type": "text/html" },
        status: 404,
      });
    } else {
      return new Response(file);
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
