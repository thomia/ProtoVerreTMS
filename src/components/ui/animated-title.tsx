import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AnimatedTitle({ 
  title = "ProtoVerreTMS", 
  subtitle = "Simulation des Troubles Musculo-Squelettiques",
  className 
}: AnimatedTitleProps) {
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
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      
      <p className="text-lg text-gray-400 mb-6">
        {subtitle}
      </p>
      
      <div className="relative flex w-full justify-center overflow-visible text-center h-[80px]">
        {titles.map((adjectif, index) => (
          <motion.span
            key={index}
            className="absolute text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
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
                    y: titleNumber > index ? -50 : 50,
                    opacity: 0,
                    scale: 0.9,
                  }
            }
          >
            {adjectif}
          </motion.span>
        ))}
      </div>
    </div>
  );
}