export type TCookieOptions = Record<string, string | boolean | number | Date>;
export type TParsedCookie = { name: string; value: string; options: TCookieOptions };

// Parses a raw "Set-Cookie" header into { name, value, options } compatible
// with next/headers cookies().set(). Shared by the auth server actions and
// serverFetch's silent-refresh path so both handle cookies identically.
export function parseSetCookie(raw: string): TParsedCookie {
  const [nameValue, ...attrs] = raw.split(";");
  const eq = nameValue.indexOf("=");
  const name = nameValue.slice(0, eq).trim();
  const value = nameValue.slice(eq + 1).trim();
  const options: TCookieOptions = {};
  for (const attr of attrs) {
    const trimmed = attr.trim();
    if (!trimmed) continue;
    const [k, v] = trimmed.split("=");
    const key = k.trim().toLowerCase();
    const val = v?.trim() ?? "";
    if (key === "httponly") options.httpOnly = true;
    else if (key === "secure") options.secure = true;
    else if (key === "samesite") options.sameSite = val.toLowerCase() === "strict" ? "strict" : "lax";
    else if (key === "path") options.path = val || "/";
    else if (key === "domain") options.domain = val;
    else if (key === "max-age") options.maxAge = parseInt(val, 10);
    else if (key === "expires") options.expires = new Date(val);
  }
  return { name, value, options };
}