"use client";
import { useGlobalContext } from "@/app/context/globalContext";
import { wind } from "@/app/utils/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";

function Wind() {
 const { forecast } = useGlobalContext();

 const windSpeed = forecast?.wind?.speed;
 const windDir = forecast?.wind?.deg;

 if (!windSpeed || !windDir) {
  return <Skeleton className="h-[12rem] w-full" />;
 }

 return (
  <div
   className="pt-6 pb-5 px-4 h-[12rem] border rounded-lg flex 
    flex-col gap-3 dark:bg-dark-grey shadow-sm dark:shadow-none"
  >
   <h2 className="flex items-center gap-2 font-medium">{wind} Wind</h2>

   <div className=" relative flex items-center justify-center">
    <div className="relative">
     <Image
      src="/compass_body.svg"
      alt="compass"
      width={110}
      height={110}
     />
     <div className="h-full w-full top-0 absolute transition-all duration-700 ease-in-out flex items-center justify-center" style={{
      transform: `rotate(${windDir}deg)`,
     }}>
      <Image
       src="/compass_arrow.svg"
       alt="compass"
       className="dark:invert"
       width={11}
       height={11}
      />
     </div>
    </div>
    <p
     className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-xs
            dark:text-white font-medium"
    >
     {Math.round(windSpeed)} m/s
    </p>
   </div>
  </div>
 );
}

export default Wind;
