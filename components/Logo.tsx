import Image from "next/image";
import logoMark from "@/public/images/logo-mark.png";

export default function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <Image
      src={logoMark}
      alt="Logo NGUERA SENEGALENSIS TECH"
      style={{ height: size, width: "auto", borderRadius: 6, flexShrink: 0 }}
      priority
    />
  );
}
