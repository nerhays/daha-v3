"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  target: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function ScrollLink({ target, children, className = "", onClick }: Props) {
  const pathname = usePathname();

  const handleClick = () => {
    onClick?.();

    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Jika bukan di halaman Home
  if (pathname !== "/") {
    return (
      <Link href={`/#${target}`} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // Jika di Home
  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
