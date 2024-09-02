"use client";

import Link from "next/link";
import { RiReactjsFill } from "react-icons/ri";
import { IoLogoHtml5 } from "react-icons/io5";
// import { FaExternalLinkSquareAlt } from "react-icons/fa";
import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const Page = () => {
  const [externalLink, setExternalLink] = useState("");

  const handleSubmit = async () => {
    try {
      
      console.log(externalLink);
      toast.success("Link submitted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit the link");
    }
  };

  return (
    <div className="m-auto p-6">
      <div className="flex flex-wrap gap-10">
        <Link href="/playgrounds/html-css-js">
          <div className="flex items-center gap-6 w-[350px] p-3 px-5 border-2 dark:bg-white dark:text-black border-slate-300 rounded-lg hover:border-gray-500">
            <div>
              <IoLogoHtml5 className="bg-slate-200 rounded-md h-20 w-20 p-2 text-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold">HTML/CSS/JS</h1>
              <p className="text-sm text-slate-500">
                Playground for html, css, and js
              </p>
            </div>
          </div>
        </Link>
        <Link href="/playgrounds/react">
          <div className="flex items-center gap-6 w-[350px] p-3 px-5 border-2 dark:bg-white dark:text-black border-slate-300 rounded-lg hover:border-gray-500">
            <div>
              <RiReactjsFill className="bg-slate-200 rounded-md h-20 w-20 p-1.5 text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">React.js</h1>
              <p className="text-sm text-slate-500">Playground for React</p>
            </div>
          </div>
        </Link>

        {/* <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-6 w-[350px] p-3 px-5 border-2 dark:bg-white dark:text-black border-slate-300 rounded-lg hover:border-gray-500 cursor-pointer">
              <div>
                <FaExternalLinkSquareAlt className="bg-slate-200 rounded-md h-20 w-20 p-1.5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold">External Links</h1>
                <p className="text-sm text-slate-500">
                  Place third-party links here
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add External Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="externalLink"
                  className="text-right text-lg"
                >
                  Link
                </Label>
                <Input
                  id="externalLink"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://example.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                onClick={handleSubmit}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default Page;