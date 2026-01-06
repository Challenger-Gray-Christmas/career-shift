import Link from "next/link";

export function Navigation() {
  return (
    <header className="border-b border-lightgray bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-charcoal">
          Career Shift
        </Link>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/explore" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Job Explorer
          </Link>
          <Link href="/pathways" className="text-sm sm:text-base text-charcoal hover:text-gold transition-colors">
            Career Pathways
          </Link>
        </div>
      </nav>
    </header>
  );
}
