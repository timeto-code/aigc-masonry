import Lightbox from "@/components/Lightbox";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full overflow-hidden">
      {children}
      <Lightbox />
    </div>
  );
};

export default layout;
