import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-cyan-500/20 pb-4">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-cyan-400"></span>
          <p className="text-[11px] font-mono font-extrabold uppercase tracking-[0.25em] text-cyan-400">
            {eyebrow}
          </p>
        </div>
        <h1 className="font-display mt-2 text-3xl font-black tracking-wider text-white uppercase neon-text-glow md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm font-mono leading-relaxed text-cyan-400/80">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
