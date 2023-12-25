import zod from "zod";

const envSchema = zod.object({
  GOOGLE_CLIENT_ID: zod.string().min(1),
  GOOGLE_CLIENT_SECRET: zod.string().min(1),
  GITHUB_CLIENT_ID: zod.string().min(1),
  GITHUB_CLIENT_SECRET: zod.string().min(1),
  DATABASE_URL: zod.string().min(1),
  NEXTAUTH_URL: zod.string().min(1),
  NEXTAUTH_SECRET: zod.string().min(1),
  CLOUDINARY_CLOUD_NAME: zod.string().min(1),
  CLOUDINARY_API_KEY: zod.string().min(1),
  CLOUDINARY_API_SECRET: zod.string().min(1),
  EMAIL_SERVER_USER: zod.string().min(1),
  EMAIL_SERVER_PASSWORD: zod.string().min(1),
  EMAIL_SERVER_HOST: zod.string().min(1),
  EMAIL_SERVER_PORT: zod.string().min(1),
  EMAIL_FROM: zod.string().min(1),
});

export const env = envSchema.parse(process.env);
