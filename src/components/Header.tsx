import {getScarTechURL} from "@/app/utility/utility";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const href = getScarTechURL();

  return (
    <Link href={href} rel="noopener noreferrer">
      <Image src="/scardule.png" alt="Scardule Logo" width={600} height={100} />
    </Link>
  );
}
