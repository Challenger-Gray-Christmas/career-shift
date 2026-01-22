import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Image
            src="/cgc-logo.svg"
            alt="Challenger, Gray & Christmas"
            width={160}
            height={28}
            priority
          />
        </Link>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/assess" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Assessment
          </Link>
          <Link href="/explore" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Job Explorer
          </Link>
        </div>
      </nav>
    </header>
  );
}
