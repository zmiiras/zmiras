/** Shared security headers applied to every SSR/document response. */

const SUPABASE_URL = (typeof process !== "undefined" ? process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] : undefined) || (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : "") || "https://jlpnljkbjejtmpzrokyd.supabase.co";
const SUPABASE_ORIGIN = SUPABASE_URL;

/** Lovable editor/preview embeds the app in an iframe, so allow those ancestors. */
const FRAME_ANCESTORS = [
  "'self'",
  "https://lovable.dev",
  "https://*.lovable.dev",
  "https://*.lovable.app",
];

const IS_DEV = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);

/**
 * Strict production CSP: no 'unsafe-inline', no 'data:', no broad 'https:' in
 * script-src; inline scripts are allowed only via a per-request nonce, and
 * 'strict-dynamic' lets nonced loaders pull their own chunks.
 */
function cspDirectives(nonce?: string): Record<string, string[]> {
  const scriptSrc = IS_DEV
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.gpteng.co"]
    : [
        "'self'",
        ...(nonce ? [`'nonce-${nonce}'`, "'strict-dynamic'"] : []),
        "https://cdn.gpteng.co",
      ];

  return {
    "default-src": ["'self'"],
    "script-src": scriptSrc,
    "script-src-attr": ["'none'"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "media-src": ["'self'", "data:", "blob:", SUPABASE_ORIGIN],
    "connect-src": [
      "'self'",
      SUPABASE_ORIGIN,
      SUPABASE_ORIGIN.replace("http", "ws"),
      ...(IS_DEV ? ["ws:", "https:"] : []),
    ],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-src": ["'self'"],
    "frame-ancestors": FRAME_ANCESTORS,
    "upgrade-insecure-requests": [],
  };
}

export function buildCsp(nonce?: string): string {
  return Object.entries(cspDirectives(nonce))
    .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
    .join("; ");
}

export const CONTENT_SECURITY_POLICY = buildCsp();

const BASE_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), geolocation=(), payment=(), usb=(), interest-cohort=(), microphone=(self)",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-site",
  "X-DNS-Prefetch-Control": "off",
};

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  ...BASE_HEADERS,
};

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes)).replace(/=+$/, "");
}

/** Adds nonce="..." to every <script> tag that doesn't already carry one. */
function addNonceToScripts(html: string, nonce: string): string {
  return html.replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${nonce}"`);
}

/**
 * Returns a response with security headers merged in. For HTML documents in
 * production the body is rewritten so every script carries a fresh nonce,
 * which lets the CSP drop 'unsafe-inline' entirely.
 */
export async function withSecurityHeaders(response: Response): Promise<Response> {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(BASE_HEADERS)) {
    headers.set(name, value);
  }

  const isHtml = (headers.get("content-type") ?? "").includes("text/html");

  if (IS_DEV || !isHtml || !response.body) {
    headers.set("Content-Security-Policy", buildCsp());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const nonce = createNonce();
  const html = addNonceToScripts(await response.text(), nonce);
  headers.set("Content-Security-Policy", buildCsp(nonce));
  headers.delete("content-length");
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
