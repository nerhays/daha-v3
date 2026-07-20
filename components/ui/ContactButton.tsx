"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ContactButton({ children, className = "" }: Props) {
  const pathname = usePathname();

  const handleClick = () => {
    const section = document.getElementById("contact");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Jika bukan di halaman Home
  if (pathname !== "/") {
    return (
      <Link href="/#contact" className={className}>
        {children}
      </Link>
    );
  }

  // Jika sedang di Home
  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
