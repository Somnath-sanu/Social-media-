"use server";

import { lucia } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import bcryptjs from "bcryptjs"
import streamServerClient from "@/lib/stream";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    const { success, error } = signUpSchema.safeParse(credentials);
    if (!success) {
      return {
        error: error.errors[0].message,
      };
    }

    const { username, email, password } = credentials;

    const passwordHash = await bcryptjs.hashSync(password , 10);

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      }); 
      //* Stream chat 
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    })

    

    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");

    //! since redirect returns never , so we dont have to return {error: },even if its signified in function return  Promise<{ error: string }>
  } catch (error) {
    if (isRedirectError(error)) throw error;
    
    console.log(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
