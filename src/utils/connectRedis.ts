import Redis from "ioredis";

const client = new Redis(process.env.APP_REDIS_URL as string);

export default client;
