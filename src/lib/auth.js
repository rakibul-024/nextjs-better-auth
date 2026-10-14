import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';


const client = new MongoClient(process.env.BETTER_Auth_DB_URL);
const db = client.db("testdb");
const resend = new Resend(process.env.RESEND_API_KEY);
const resendFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { data, error } = await resend.emails.send({
        from: resendFrom,
        to: user.email,
        subject: "Reset your password",
        html: `<h4>Reset your password</h4>
          <p><a href="${url}">Click here to reset your password</a>.</p>
          <p>If you didn't request a password reset, you can ignore this email.</p>`,
      });
      if (error) {
        console.error("Resend rejected the password reset email", error);
        throw new Error(`Resend failed to send password reset email: ${error.message}`);
      }
      console.info("Resend accepted the password reset email", { id: data.id });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: resendFrom,
        to: user.email,
        subject: "Verify your email address",
        html: `<h1>Please verify your email address</h1>
          <p>Click <a href="${url}">here</a> to verify your email.</p>`,
      });

      if (error) {
        console.error("Resend rejected the verification email", error);
        throw new Error(`Resend failed to send verification email: ${error.message}`);
      }
    },
    sendOnSignUp: false,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 7 * 24 * 60 * 60,
  },
  socialProviders: {
    google: {
      clientId:
        process.env.BETTER_AUTH_GOOGLE_CLIENT_ID ||
        process.env.BETTER_AUTH_GEOGLE_CLIENT_ID,
      clientSecret:
        process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET ||
        process.env.BETTER_AUTH_GEOGLE_SECRET,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret:
        process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET ||
        process.env.BETTER_AUTH_GITHUB_SECRET,
    },
  },
account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["github", "google"],
			requireLocalEmailVerified: false,
		}
	},
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});
