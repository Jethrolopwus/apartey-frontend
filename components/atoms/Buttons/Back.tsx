"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { ArrowLeft} from "lucide-react";

function Back() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className=" px-2 py-1.5 flex cursor-pointer items-center gap-1  transition-all duration-300 border hover:border-[#C85212] bg-white rounded-md border-[#efefef]"
    >
      < ArrowLeft size={13}/>
      <span className="text-xs">Back</span>
    </button>
  );
}

export default Back;
