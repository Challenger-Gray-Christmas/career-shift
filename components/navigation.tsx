import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center px-4">
        <Link href="/assess">
          <Image
            src="/cgc-logo.svg"
            alt="Challenger, Gray & Christmas"
            width={160}
            height={28}
            priority
          />
        </Link>
      </nav>
    </header>
  );
}
