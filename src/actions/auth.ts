"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db";
import { UserLogin, UserSignUp, userSignUp } from "@/lib/userSchema";
import { BuiltInProviderType } from "@auth/core/providers";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function oauth(provider: BuiltInProviderType) {
  await signIn(provider);
}
export async function login(data: UserLogin) {
  try {

    await signIn("credentials", data);
    return undefined;
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.log(error);
    if (error instanceof Error) {
      const { type, cause } = error as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        case "CallbackRouteError":
          return cause?.err?.toString();
        default:
          return "Something went wrong.";
      }

    }

    throw error;
  }
}

export async function signUp(data: UserSignUp) {
  const parsedData = userSignUp.safeParse(data);
  if (!parsedData.success) {
    return { status: "error", data: "Invalid credentials" };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });

  if (user) {
    return { status: "error", data: "User already exists" };
  } else {
    await prisma.user.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        password: bcrypt.hashSync(parsedData.data.password, 10),
      },
    });
    return {
      status: "success",
      data: "Click on the activation link send to your eamil",
    };
  }
}

export async function resetPassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return { status: "error", data: "User does not exist" };

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 10),
      },
    });

    return { status: "success", data: "Password reset successfully" };
  } catch (error) {
    return { status: "error", data: "Something went wrong" };
  }
}