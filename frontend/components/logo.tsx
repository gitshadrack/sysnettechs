import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Sysnettech Solutions home">
      <Image
        src="/images/sysnettech-icon-refined-v2.svg"
        width={512}
        height={512}
        priority
        alt="Sysnettech Solutions connected network S logo"
        className={`h-10 w-10 sm:hidden ${light ? "brightness-0 invert" : "dark:brightness-0 dark:invert"}`}
      />
      <Image
        src="/images/sysnettech-logo-refined-v2.svg"
        width={900}
        height={260}
        priority
        alt="Sysnettech Solutions Ltd"
        className={`hidden h-auto w-[145px] sm:block lg:w-[158px] ${light ? "brightness-0 invert" : "dark:brightness-0 dark:invert"}`}
      />
    </Link>
  );
}
