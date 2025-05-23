const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) { }

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001,http://localhost:9000";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000,http://localhost:5173";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

// const REDIS_URL = process.env.REDIS_URL || "redis-13905.c330.asia-south1-1.gce.cloud.redislabs.com:13905";


const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  `medusa-plugin-meilisearch`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      // other options...
      apiKey: process.env.MEILISEARCH_API_KEY,
      host: process.env.MEILISEARCH_HOST,
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: [
              "title",
              "description",
              "variant_sku",
            ],
            displayedAttributes: [
              "id",
              "title",
              "description",
              "variant_sku",
              "thumbnail",
              "handle",
            ],
          },
          primaryKey: "id",
        },
      },
    },
  },
  {
    resolve: `medusa-plugin-twilio-sms`,
    options: {
      account_sid: process.env.TWILIO_SMS_ACCOUNT_SID,
      auth_token: process.env.TWILIO_SMS_AUTH_TOKEN,
      from_number: process.env.TWILIO_SMS_FROM_NUMBER,
    },
  },
];


const modules = {
  // eventBus: {
  //   resolve: "@medusajs/event-bus-redis",
  //   options: {
  //     redisUrl: REDIS_URL
  //   }
  // },
  // cacheService: {
  //   resolve: "@medusajs/cache-redis",
  //   options: { 
  //     redisUrl: process.env.CACHE_REDIS_URL,
  //     ttl: 30,
  //   },
  // },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};



/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};

// module.exports = {
//   projectConfig: {
//     redis_url: process.env.REDIS_URL ||
//       "redis-13905.c330.asia-south1-1.gce.cloud.redislabs.com:13905",
//     redis_prefix: process.env.REDIS_PREFIX ||
//       "medusa:",
//     redis_options: {
//       connectionName: process.env.REDIS_CONNECTION_NAME ||
//         "medusa",
//     },
//     session_options: {
//       name: process.env.SESSION_NAME ||
//         "custom",
//     },
//     http_compression: {
//       enabled: true,
//       level: 6,
//       memLevel: 8,
//       threshold: 1024,
//     },
//     jobs_batch_size: 100,
//     jobs_max_attempts: 3,
//     jobs_retry_delay: 1000,
//     jobs_ttl: 1000 * 60 * 60 * 24 * 30,

//   },
// }


