import {
  getMentorPieChartData,
  getStudentEvaluatedAssigmentsForMentor,
} from "@/actions/assignments";
import { getAttendanceOfStudent } from "@/actions/attendance";
import { getDashboardData } from "@/actions/getLeaderboard";
import StudentStatClient from "@/components/studentStatClient";
  
  export default async function Page({params}:any) {
    const mentorPieChart = await getMentorPieChartData(params.course);
    const { evaluated, underReview, unsubmitted, totalPoints}:any = await getStudentEvaluatedAssigmentsForMentor(params.studentId, params.course);
    let loaderValue = !mentorPieChart
      ? 0
      : String(
          (mentorPieChart![0] * 100) / (mentorPieChart![0] + mentorPieChart![1])
        );
    loaderValue += "%";
    const {classes,attendanceDates} = await getAttendanceOfStudent(params.studentId,params.course);
    const data = await getDashboardData();
    return (
      <div>
        <h1 className="text-blue-400 text-2xl p-10 font-bold">Student - {params.studentId}</h1>
        <StudentStatClient 
        totalEvaluatedAssigmentsOfStudent={evaluated}
        totalPoints={totalPoints}
        forBarChart={[evaluated, underReview, unsubmitted]}
        classes={classes}
        attendanceDates={attendanceDates}
        data={data}
        />
      </div>
    );
  }
