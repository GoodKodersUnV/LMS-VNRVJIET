"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import _ from "lodash";
import toast from "react-hot-toast";
import Filters from "./filters";

const AttendanceClient = ({courses}:any) => {
  const [fileData, setFileData] = useState<any>([]);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [currentClass, setCurrentClass] = useState<any>(null);
  // const students = [
  //   {
  //     "Name": "23071A67H4 (RIDA ALMAS MUJAHID)",
  //     "JoinTime": "04/26/2024 06:37:06 PM",
  //     "LeaveTime": "04/26/2024 08:26:28 PM",
  //     "Duration": 110,
  //   },
  // ];

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
  };

  const onSelectFile = (file: Blob) => {
    setSelectedFile(file);
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = (e.target as FileReader).result;
        const workbook = XLSX.read(result, {
          type: "binary",
          cellDates: true,
        });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        data.forEach((row: any) => {
          _.forIn(row, (value: any, key: any) => {
            if (value instanceof Date) {
              row[key] = value.toISOString().split("T")[0];
            }
          });
        });
        console.log(data);
        console.log(file);

        setFileData(data);
      };
      reader.onerror = () => {
        throw new Error("Error in reading file");
      };

      reader.readAsBinaryString(file);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const aggregatedStudents = fileData.reduce((acc: any, student: any) => {
    const firstTenCharsName = String(student.Name).substring(0, 10);
    if (!acc[firstTenCharsName]) {
      acc[firstTenCharsName] = {
        Name: student.Name,
        Joins: [
          {
            JoinTime: student.JoinTime,
            LeaveTime: student.LeaveTime,
            ActualName: student.Name,
            Duration: parseInt(student.Duration),
          },
        ],
        Duration: parseInt(student.Duration),
      };
    } else {
      acc[firstTenCharsName].Joins.push({
        JoinTime: student.JoinTime,
        LeaveTime: student.LeaveTime,
        ActualName: student.Name,
        Duration: parseInt(student.Duration),
      });
      acc[firstTenCharsName].Duration += parseInt(student.Duration);
    }
    return acc;
  }, {});

  const sortedAggregatedStudents = Object.values(aggregatedStudents).sort(
    (a: any, b: any) => {
      const nameA = String(a.Name).toUpperCase();
      const nameB = String(b.Name).toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  );
//   return <pre>{JSON.stringify(courses,null,2)}</pre>
  return (
    <div className="p-4 text-center ">
      {/* {selectedFile && (
        <p className="text-sm text-gray-500">
          {selectedFile.name} - {(selectedFile.size / 1024).toFixed(2)} KB
        </p>
      )} */}
      <h1 className="text-4xl mt-4 font-semibold mb-4">Attendance</h1>
      <h1 className="text-center text-lg">Monitor your mentees attendance</h1>
      <div className="flex justify-between w-[80%] m-auto mt-8">
        <div className="flex gap-2 items-center">
          <select name="" id="" className="p-2 rounded outline-none">
            <option disabled value="">select course</option>
            {
                courses.length===0?<option value="">null</option>:
                courses.map((course:any)=>{
                    return <option onClick={()=>setCurrentCourse(course.id)} key={course.id} value={currentCourse}>{course.title}</option>
                })
            }
          </select>
          <select name="" id="" className="p-2 rounded outline-none">
            {
                currentCourse==null?<option value="">null</option>:
                <div>have</div>
            }
          </select>
        </div>
        <div>
          <input
            type="file"
            className="bg-primary-600 rounded cursor-pointer w-60 text-white font-semibold border-none outline-none shadow-md hover:bg-primary-700 transition duration-300 ease-in-out"
            accept=".csv, .xlsx"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                onSelectFile(files[0]);
              }
            }}
          />
        </div>
      </div>
      <table className="w-[80%] m-auto mt-10">
        <thead>
          <tr className="border-b">
            <th>index</th>
            <th className="py-2">Name</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Times Joined</th>
          </tr>
        </thead>
        <tbody>
          {sortedAggregatedStudents.map((student: any, index) => (
            <tr key={index} onClick={() => handleStudentClick(student)}>
              <td>{index + 1}</td>
              <td className="py-2 cursor-pointer">
                {String(student?.Name).substring(0, 10).toUpperCase()}
              </td>
              <td>{student.Duration}</td>
              <td>{student.Joins[0].JoinTime.split(" ")[0]}</td>
              <td>{student.Joins.length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStudent && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white text-gray-700 p-4 rounded-md w-[60%]">
            <h2 className="text-lg font-semibold mb-2">
              Attendance Details for {String(selectedStudent?.Name)}
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Actual Name</th>
                  <th className="border px-4 py-2">Join Time</th>
                  <th className="border px-4 py-2">Leave Time</th>
                  <th className="border px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.Joins.map((join: any, index: number) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{join.ActualName}</td>
                    <td className="border px-4 py-2">{join.JoinTime}</td>
                    <td className="border px-4 py-2">{join.LeaveTime}</td>
                    <td className="border px-4 py-2">{join.Duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceClient;