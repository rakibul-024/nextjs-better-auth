import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';


const client = new MongoClient(process.env.BETTER_Auth_DB_URL);
const db = client.db("testdb");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
 sendVerificationEmail: async ( { user, url, token }, request) => {
void resend.emails.send({
   from: 'Acme <onboarding@example.com>',
  to: user.email,
        subject: 'Verify your email address',
        html: `Click <a href="${url}">here</a> to verify your email.`,
});

  },
  socialProviders: {
  google:{
    clientId:process.env.BETTER_AUTH_GEOGLE_CLIENT_ID,
    clientSecret: process.env.BETTER_AUTH_GEOGLE_SECRET ,
  },
  github:{
    clientId:process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
    clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
  }
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
