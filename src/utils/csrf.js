import { doubleCsrf } from "csrf-csrf";
import { configs } from "../config/index.js";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => configs.secrets.csrf_secret,
  getSessionIdentifier: (req) => req.cookies.accessToken || "anonymous",
});

export const getCsrfToken = (req, res) => {
  const csrfToken = generateCsrfToken(req, res);
  return res.json({ csrfToken: csrfToken });
};

export { doubleCsrfProtection };
