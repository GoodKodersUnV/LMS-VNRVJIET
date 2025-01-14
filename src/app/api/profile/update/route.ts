import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { db } from "@/lib/db";
import * as z from "zod";
import getCurrentUser from "@/actions/getCurrentUser";

const userSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface UpdatePasswordType {
  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
  email: string;
}

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json("Unauthorized", { status: 401 });
  try {
    const body = (await req.json()) as UpdatePasswordType;
    const { newPassword, confirmPassword, oldPassword, email } =
      userSchema.parse(body);
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords don't match" },
        { status: 401 },
      );
    }

    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 },
      );
    }

    if (userExists.password !== null) {
      if (!oldPassword) {
        return NextResponse.json(
          { message: "Please provide old password" },
          { status: 404 },
        );
      }

      const isPasswordValid = await compare(oldPassword, userExists.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Old password is incorrect" },
          { status: 401 },
        );
      }
    }

    const password = await hash(newPassword, 10);

    await db.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 },
    );
  }
}
