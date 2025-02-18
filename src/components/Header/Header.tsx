import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-primary flex flex-row justify-between items-center py-4 px-5 border-b-4 border-black overflow-hidden">
      <Link href="https://yellowexpress.com.au">
        <Image
          src="/logo.png"
          alt="Yellow Express Logo"
          width={134}
          height={80}
          priority
          className="w-[134px] h-[80px]"
        />
      </Link>
      <a
        className="text-black bg-primary px-3 py-2 rounded border border-black flex flex-row gap-2.5 items-center"
        href="tel:1300935569"
      >
        <Image src="/phone.svg" alt="Phone Icon" width={16} height={16} />
        <span className="font-bold text-sm">Need help?</span>
      </a>
    </header>
  );
};
