"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { IoWarningOutline } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSandpack } from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";

const Submit = ({
  user,
  assignmentDetails,
  mentorDetails,
  isLoading,
}: {
  user: any;
  assignmentDetails: any;
  mentorDetails: any;
  isLoading?: boolean;
}) => {
  const [confetti, setConfetti] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("Submit");
  const { sandpack } = useSandpack();
  const { files } = sandpack || {};

  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !user ||
      !user.username ||
      !user.email ||
      !assignmentDetails ||
      !assignmentDetails.title
    ) {
      toast.error("Error submitting assignment");
      return;
    }

    try {
      const maxSubmissions = assignmentDetails.maxSubmissions;
      if (maxSubmissions <= assignmentDetails.submissions.length) {
        toast.error("Assignment has reached maximum number of submissions");
        return;
      }
      setSubmitting(true);
      toast.loading("Submitting assignment");

      const submission = await axios.post(`/api/assignment/submit`, {
        assignmentDetails,
        files: files,
        mentorDetails,
      });
      toast.dismiss();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
      toast.success("Assignment submitted successfully");
      setStatus("Submitted");
      router.back();
    } catch (e) {
      toast.dismiss();
      toast.error("Error submitting assignment");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild >
        <Button
          className="rounded border  hover:bg-white hover:text-black text-white "
          disabled={isSubmitting || status === "Submitted"}
        >
          {status}
        </Button>
      </AlertDialogTrigger>
      <div>
        {confetti && (
          <Confetti
            width={1600}
            height={window.innerHeight || 1000}
            numberOfPieces={400}
            friction={0.99}
            colors={[
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
              "#00ffff",
            ]}
          />
        )}
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm Submission
          </AlertDialogTitle>
          <p className="mb-2">
            Are you sure you want to submit the
            <a href={`${assignmentDetails.link}`} target="_blank" className="text-blue-500">
              &nbsp;{assignmentDetails.title}
            </a> ?
          </p>
          <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
            <IoWarningOutline className="text-md" /> Once submitted, you cannot edit your code.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="mr-2 bg-gray-200 hover:bg-gray-300 text-black"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading || isSubmitting || status === "Submitted"}
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSubmit}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Submit;