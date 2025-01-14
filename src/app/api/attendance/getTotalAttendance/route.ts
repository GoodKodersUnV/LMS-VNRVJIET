import { getTotalNumberOfClassesAttended } from "@/actions/attendance";
import { totalNumberOfClasses } from "@/actions/classes";
import getCurrentUser from "@/actions/getCurrentUser";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const totalAttendance = await getTotalNumberOfClassesAttended(
      currentUser?.enrolledUsers[0]?.courseId ?? "",
    );
    const totalCount = await totalNumberOfClasses(
      currentUser?.enrolledUsers[0]?.courseId ?? "",
    );

    const jsonData = Object.entries(totalAttendance).map(
      ([username, value]: [string, any]) => ({
        username: value.username,
        name: value.name,
        mail: value.mail,
        image: value.image,
        role: value.role,
        percentage: (Number(value.count) * 100) / totalCount,
      }),
    );

    return NextResponse.json(jsonData, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
