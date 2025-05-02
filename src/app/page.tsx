import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full h-full p-10">
      <div className="space-y-5 mx-auto transform translate-y-1/2">
        <h1 className="text-4xl">Welcome to Next player</h1>
        <p>Manage your team with our dashbord</p>
        <Link
          href={"/dashboard"}
          className="bg-blue-600 rounded px-4 py-2">
          Access Players
        </Link>
      </div>
    </main>
  );
}
