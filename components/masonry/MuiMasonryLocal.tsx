"use client";

import { ExifTags } from "@/lib/api";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import React from "react";
import MemoizedLocalCard from "../card/LocalCard";

interface Props {
  images: ExifTags[];
}

const MuiMasonryLocal = ({ images }: Props) => {
  const [masonryWidth, setMasonryWidth] = React.useState(4 * 330 + 5 * 8);
  const [columns, setColumns] = React.useState(4);

  React.useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth < 688) {
        setColumns(1);
        setMasonryWidth(1 * 330 + 2 * 8);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
        setMasonryWidth(2 * 330 + 3 * 8);
      } else if (window.innerWidth < 1360) {
        setColumns(3);
        setMasonryWidth(3 * 330 + 4 * 8);
      } else if (window.innerWidth < 1696) {
        setColumns(4);
        setMasonryWidth(4 * 330 + 5 * 8);
      } else if (window.innerWidth < 2032) {
        setColumns(5);
        setMasonryWidth(5 * 330 + 6 * 8);
      } else if (window.innerWidth < 2368) {
        setColumns(6);
        setMasonryWidth(6 * 330 + 7 * 8);
      } else if (window.innerWidth < 2704) {
        setColumns(7);
        setMasonryWidth(7 * 330 + 8 * 8);
      } else if (window.innerWidth < 3040) {
        setColumns(8);
        setMasonryWidth(8 * 330 + 9 * 8);
      } else {
        setColumns(9);
        setMasonryWidth(9 * 330 + 10 * 8);
      }
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  if (!images) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">No images found</p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-4">
      <Box sx={{ width: masonryWidth, pl: 2 }}>
        <Masonry columns={columns} spacing={2} sx={{}}>
          {images!.map((img, index) => (
            <div key={index}>
              <MemoizedLocalCard img={img} />
            </div>
          ))}
        </Masonry>
      </Box>
    </div>
  );
};

export default MuiMasonryLocal;
