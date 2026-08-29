import type { Connect, Plugin } from "vite";
import { pathToFileURL } from "node:url";
import path from "node:path";

/**
 * Serves the Netlify Function at `netlify/functions/api.mjs` on `/api` (and
 * `/.netlify/functions/api`) during `vite dev` / `vite preview`, so the app's
 * backend works without running `netlify dev` separately.
 */
export default function apiPlugin(): Plugin {
  const fnPath = path.resolve(__dirname, "netlify/functions/api.mjs");

  const handle: Connect.NextHandleFunction = async (req, res, next) => {
    if (req.method !== "POST") return next();
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = Buffer.concat(chunks).toString("utf8");

      // Fresh import each request so edits to the function hot-reload.
      const mod = await import(
        `${pathToFileURL(fnPath).href}?t=${Date.now()}`
      );
      const result = await mod.handler({
        httpMethod: req.method,
        headers: req.headers,
        body,
        path: req.url,
      });

      res.statusCode = result.statusCode ?? 200;
      for (const [key, value] of Object.entries(result.headers ?? {})) {
        res.setHeader(key, value as string);
      }
      res.end(result.body ?? "");
    } catch (err) {
      console.error("[dev api]", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "dev function crashed — see terminal" }));
    }
  };

  return {
    name: "local-netlify-api",
    configureServer(server) {
      server.middlewares.use("/api", handle);
      server.middlewares.use("/.netlify/functions/api", handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api", handle);
      server.middlewares.use("/.netlify/functions/api", handle);
    },
  };
}
