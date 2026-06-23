import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({
  icon,
  title,
  href,
  testIdPrefix,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  testIdPrefix?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4" data-testid={testIdPrefix ? `${testIdPrefix}-header` : undefined}>
      <h2
        className="flex items-center gap-2 text-lg font-bold font-[var(--font-display)] text-[var(--color-text-primary)]"
        data-testid={testIdPrefix ? `${testIdPrefix}-title` : undefined}
      >
        {icon}
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors font-medium"
          data-testid={testIdPrefix ? `${testIdPrefix}-link` : undefined}
        >
          Ver todo
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
