import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

async function sendVerificationRequest(params: any) {
  const { identifier, url, provider } = params;
  const transport = (await import("nodemailer")).createTransport(
    provider.server,
  );
  await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to Bachat`,
    text: `Sign in to Bachat\n${url}\n\n`,
    html: `
      <body>
        <h2>Sign in to Bachat</h2>
        <p>Click the link below to sign in to your account.</p>
        <a href="${url}" style="display:inline-block;padding:10px 20px;background-color:#0f6b4a;color:#ffffff;text-decoration:none;border-radius:5px;">Sign in</a>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${url}">${url}</a></p>
      </body>
    `,
  });
  
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  pages: {
    signIn: "/login",
    newUser: "/onboarding", // New users will be directed here on first sign in
  },
  providers: [
    Google,
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
});
