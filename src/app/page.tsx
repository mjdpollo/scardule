import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const isProduction = process.env.NODE_ENV === "production";
  const href = isProduction ? "https://scartech.site" : "http://127.0.0.1:8000";

  return (
    <Link href={href} rel="noopener noreferrer">
      <Image src="/scardule.png" alt="Scardule Logo" width={200} height={50} />
    </Link>
  );
}
