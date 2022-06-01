export function decodeIndent(code: string | undefined) {
  if (!code) return "";

  const decodeFromBase64 = Buffer.from(code, "base64").toString("utf-8");

  return decodeFromBase64.replace(/&\[CODIGA_INDENT\]/g, "  ");
}
