import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Read-only Sanity client used for GROQ queries from the browser.
 *
 * Writes never happen here — they go through the authenticated backend
 * (`src/utils/api.ts` → Netlify Functions), which holds the write token.
 * `VITE_SANITY_READ_TOKEN` is optional and, if set, must be a *viewer*
 * (read-only) token — never a write/deploy token.
 */
export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-06-10",
  // CDN caches reads for up to a minute — with it on, your own likes/comments
  // appear to "vanish" on refresh until the cache expires. Correctness over the
  // small latency win.
  useCdn: false,
  token: import.meta.env.VITE_SANITY_READ_TOKEN || undefined,
  perspective: "published",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: string) => builder.image(source);

/**
 * A CDN-resized, auto-format URL for a Sanity image. Falls back to the raw URL
 * if the builder can't parse the source (e.g. a non-Sanity URL).
 */
export const imgUrl = (
  source: string | undefined | null,
  width = 800,
  height?: number
): string | undefined => {
  if (!source) return undefined;
  try {
    let b = builder.image(source).width(width).auto("format").fit("max");
    if (height) b = b.height(height);
    return b.url();
  } catch {
    return source;
  }
};
