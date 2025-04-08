"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  gradient: string
  iconColor: string
}

export function EspacePersonnelNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()

  const isDarkTheme = theme === "dark"

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Overview",
      href: "/espace-personnel",
      gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
      iconColor: "text-blue-500",
    },
    {
      icon: <PlusCircle className="h-5 w-5" />,
      label: "Nouvelle analyse",
      href: "/espace-personnel/nouvelle-analyse",
      gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
      iconColor: "text-green-500",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Paramètres",
      href: "/espace-personnel/parametres",
      gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
      iconColor: "text-red-500",
    },
  ]

  const itemVariants = {
    initial: { rotateX: 0, opacity: 1 },
    hover: { rotateX: -90, opacity: 0 },
  }

  const backVariants = {
    initial: { rotateX: 90, opacity: 0 },
    hover: { rotateX: 0, opacity: 1 },
  }

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 2,
      transition: {
        opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
      },
    },
  }

  const navGlowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const sharedTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.5,
  }

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  return (
    <motion.nav
      className="p-2 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-800/40 backdrop-blur-lg border border-slate-700/40 shadow-lg relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className={`absolute -inset-2 bg-gradient-radial from-transparent ${
          isDarkTheme
            ? "via-blue-400/30 via-30% via-purple-400/30 via-60% via-red-400/30 via-90%"
            : "via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90%"
        } to-transparent rounded-3xl z-0 pointer-events-none`}
        variants={navGlowVariants}
      />
      <ul className="flex items-center justify-center gap-4 relative z-10">
        {menuItems.map((item, index) => (
          <motion.li key={item.label} className="relative">
            <motion.div
              className="block rounded-xl overflow-visible group relative"
              style={{ perspective: "600px" }}
              whileHover="hover"
              initial="initial"
            >
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                variants={glowVariants}
                style={{
                  background: item.gradient,
                  opacity: 0,
                  borderRadius: "16px",
                }}
              />
              <motion.a
                onClick={() => handleNavigate(item.href)}
                className={`flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl cursor-pointer ${
                  pathname === item.href || (item.href === "/espace-personnel" && pathname.includes("/espace-personnel/analyses")) 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
                variants={itemVariants}
                transition={sharedTransition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
              >
                <span className={`transition-colors duration-300 ${
                  pathname === item.href || (item.href === "/espace-personnel" && pathname.includes("/espace-personnel/analyses"))
                    ? item.iconColor
                    : "text-gray-400 group-hover:" + item.iconColor
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </motion.a>
              <motion.a
                onClick={() => handleNavigate(item.href)}
                className={`flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl cursor-pointer ${
                  pathname === item.href || (item.href === "/espace-personnel" && pathname.includes("/espace-personnel/analyses")) 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
                variants={backVariants}
                transition={sharedTransition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
              >
                <span className={`transition-colors duration-300 ${
                  pathname === item.href || (item.href === "/espace-personnel" && pathname.includes("/espace-personnel/analyses"))
                    ? item.iconColor
                    : "text-gray-400 group-hover:" + item.iconColor
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </motion.a>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
