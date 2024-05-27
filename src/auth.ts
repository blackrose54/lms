import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { userlogin } from "./lib/userSchema";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "./lib/db";
import {
  generateTwoFactorToken,
  getTwoFactorConfirmationByUserID,
  getTwoFactorTokenByEmail,
} from "./lib/twoFactor";
import { sendTwoFactorTokenEmail } from "./lib/mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        const parsedData = userlogin.safeParse(credentials);

        if (!parsedData.success) {
          return { status: "error", data: "Invalid data received" };
        }
        user = await prisma.user.findUnique({
          where: {
            email: parsedData.data.email,
          },
        });

        if (user && user.password) {
          const hash = bcrypt.compareSync(
            parsedData.data.password,
            user.password
          );
          if (hash) {
            if (user.twoFactorEnabled) {
              const token = await getTwoFactorTokenByEmail(
                parsedData.data.email
              );
              if (!token) {
                
                throw new Error("2FA:NoToken");
              }
              if (parsedData.data.code) {
                if (new Date(token.expires).getTime() > new Date().getTime()) {
                  if (token.token !== parsedData.data.code)
                    throw new Error("2FA:Invalid code");

                  const twofactorConfirmation =
                    await prisma.twoFactorConfirmation.findFirst({
                      where: {
                        userId: user.id,
                      },
                    });
                  if (twofactorConfirmation) {
                    await prisma.twoFactorConfirmation.delete({
                      where: {
                        userId: user.id,
                      },
                    });
                  }

                  await prisma.twoFactorConfirmation.create({
                    data: {
                      userId: user.id,
                    },
                  });
                } else {
                  throw new Error("2FA:Code expired");
                }
              } else {
                throw new Error("2FA:Missing OTP");
              }
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
    Google,
  ],
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existinguser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!existinguser?.emailVerified) return false;
      //implemetation of 2FA

      if (existinguser.twoFactorEnabled && user.id) {
        const twofactorConfirmation = await getTwoFactorConfirmationByUserID(
          user.id
        );
        await prisma.twoFactorConfirmation.delete({
          where: {
            userId: user.id,
          },
        });
      }
      return true;
    },
    async redirect(){
      return '/dashboard';
    }
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});
