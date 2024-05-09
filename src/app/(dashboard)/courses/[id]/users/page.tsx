import { getEnrolledStudentsByCourseId } from "@/actions/courses";
import TableOfUsers from "./_components/TableOfUsers";



export default async function Page({ params, }: {params: { id: string }}) {
    const enrolledStudents = await getEnrolledStudentsByCourseId( params.id )
    return (
        <div>
            <TableOfUsers props={enrolledStudents} />
        </div>
    )
}
