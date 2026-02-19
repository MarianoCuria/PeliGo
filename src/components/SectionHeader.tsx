import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-lg font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
        {icon}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-medium"
        >
          Ver todo
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
