import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  preload?: boolean;
  heightPx?: number;
}

export function BrandLogo({ className = "", preload = false, heightPx = 36 }: BrandLogoProps) {
  return (
    <span className={`inline-block shrink-0 self-start ${className}`.trim()} style={{ height: heightPx }}>
      <Image
        src="/images/crediwise/crediwise-logo.png"
        alt="CrediWise"
        width={2056}
        height={765}
        unoptimized
        preload={preload}
        className="!h-full !w-auto max-w-none object-contain"
        style={{ width: "auto", height: heightPx }}
      />
    </span>
  );
}
