import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export default function Button({ href = "#", children, variant = "primary" }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition";

  const styles = {
    primary: "bg-blue-700 text-white hover:bg-blue-800",

    outline: "border border-white text-white hover:bg-white hover:text-blue-800",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
