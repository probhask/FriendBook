/**
 * Thin client for the authenticated backend (Netlify Functions).
 *
 * Every write (create / patch / delete / asset upload) goes through here so the
 * Sanity write token stays server-side. The session lives in an HttpOnly cookie,
 * so requests just need `credentials: "include"`.
 *
 * In dev, `vite-plugin-api` serves this path from `netlify/functions/api.mjs`.
 * In production it's the deployed Netlify Function directly (no redirect needed).
 */
const ENDPOINT = "/.netlify/functions/api";

export async function callApi<T>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action, payload }),
    });
  } catch {
    throw new Error("network error — please check your connection");
  }

  const data = (await res.json().catch(() => ({}))) as
    | (T & { error?: string })
    | { error?: string };

  if (!res.ok) {
    throw new Error(
      (data && "error" in data && data.error) || `request failed (${res.status})`
    );
  }
  return data as T;
}

/** Encode a File as bare base64 (no `data:` prefix) for `uploadAsset`. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("could not read file"));
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("could not read file"));
        return;
      }
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}
