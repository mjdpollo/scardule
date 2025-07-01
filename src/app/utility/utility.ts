export function getScarTechURL(): string {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? "https://scartech.site" : "http://127.0.0.1:8000";
}
