
import getCurrentUser from "@/actions/getCurrentUser";
import { createSubmission } from "@/actions/submission";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    assignmentDetails,
    files,
  } = await request.json();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    const response :any = await createSubmission(assignmentDetails, files);
    if(!response){
      return NextResponse.json({ error: "Error submitting assignment" }, { status: 400 });
    }
    return NextResponse.json({ success: "Assignment submitted successfully"});
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}