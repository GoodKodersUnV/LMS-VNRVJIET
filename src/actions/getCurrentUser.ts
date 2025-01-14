import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.username) return null;

    const currentUser = await db.user.findUnique({
      where: {
        username: session.user.username,
      },
      include: {
        adminForCourses: {
          select: {
            id: true,
          },
        },
        enrolledUsers: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!currentUser) {
      throw new Error("Not signed in");
    }

    const { oneTimePassword, ...rest } = currentUser;

    return rest;
  } catch {
    return null;
  }
}
