import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedTitle() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Simple", "Ludique", "Dynamique", "Scientifique", "Unique", "Intuitif"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-evenly w-full h-full py-8">
        <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
          Un modèle
        </span>
        <div className="relative flex w-full justify-center overflow-visible text-center h-[120px]">
          {titles.map((title, index) => (
            <motion.span
              key={index}
              className="absolute text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 80 }}
              transition={{ 
                type: "spring", 
                stiffness: 50,
                damping: 20
              }}
              animate={
                titleNumber === index
                  ? {
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }
                  : {
                      y: titleNumber > index ? -80 : 80,
                      opacity: 0,
                      scale: 0.9,
                    }
              }
            >
              {title}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
} 