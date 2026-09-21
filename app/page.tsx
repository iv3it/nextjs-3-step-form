import Image from "next/image";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-[1240px]">
        <ProductList />
      </main>
    </div>
  );
}
