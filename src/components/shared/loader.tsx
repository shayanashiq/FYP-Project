// // src/components/loader.tsx
// export default function Loading() {
//   return (
//     <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
//       <div className="spinner" />
//       <style jsx>{`
//         .spinner {
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
//           border-left-color: #09f;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import React from "react";

const Loader = ({ size }: { size?: string }) => {
  return (
    <div className="flex items-center justify-center my-5">
      <div className={`relative ${size === "sm" ? "w-7 h-7" : "w-10 h-10"} `}>
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#579FE1] opacity-75"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-[#579FE1] opacity-50"></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            size === "sm" ? "w-4 h-4" : "w-7 h-7"
          }  bg-[#579FE1] rounded-full`}
        ></div>{" "}
      </div>
    </div>
  );
};

export { Loader };
