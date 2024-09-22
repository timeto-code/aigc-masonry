import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/civitai");

  return (
    <div className="h-full flex items-center justify-center overflow-hidden">
      <Image src="/CivitaiLogoColor.svg" alt="Civitai" width={200} height={200} />
    </div>
  );
}
