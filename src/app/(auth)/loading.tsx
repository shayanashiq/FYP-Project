import { Loader } from "@/components/shared/loader";
import React from "react";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
};

export default Loading;
