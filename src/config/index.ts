import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const stage = process.env.STAGE || "local";

let envConfig;

if (stage === "production") {
  envConfig = (await import("./prod.js")).default;
} else if (stage === "test") {
  envConfig = (await import("./test.js")).default;
} else {
  envConfig = (await import("./local.js")).default;
}

const defaultConfigs = {
  stage,
  env: process.env.NODE_ENV,
  port: 8734,
  secrets: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    csrf_secret: process.env.CSRF_SECRET,
    dbUrl: process.env.DATABASE_URL,
  },
};

export const configs = merge(defaultConfigs, envConfig);
