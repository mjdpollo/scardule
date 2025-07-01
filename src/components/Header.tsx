import {getScarTechURL} from "@/app/utility/utility";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const href = getScarTechURL();

  return (
    <Link href={href} rel="noopener noreferrer">
      <Image src="/scardule.png" alt="Scardule Logo" width={200} height={50} />
    </Link>
  );
}
