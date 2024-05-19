import { enrollStudentToCourse } from "@/actions/courses";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {courseId,username} = await request.json();

    try {
        console.log(courseId, username);
        
        const user = await enrollStudentToCourse(courseId, username);
        return NextResponse.json(user );
    } catch (e :any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}