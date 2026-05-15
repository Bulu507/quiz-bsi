import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Tone = "blue" | "green" | "yellow" | "red" | "neutral";

export function Button({
  children,
  href,
  variant = "default",
  ...props
}: {
  children: ReactNode;
  href?: string;
  variant?: "default" | "primary" | "ghost";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const className = `btn ${variant === "primary" ? "primary" : ""} ${
    variant === "ghost" ? "ghost" : ""
  }`.trim();

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={`badge ${tone === "neutral" ? "" : tone}`}>{children}</span>;
}

export function PageHeader({
  eyebrow,
  title,
  actions
}: {
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
      </div>
      {actions ? <div className="actions">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  action,
  children
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" aria-label={`Progress ${value}%`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link className={`brand ${dark ? "dark" : ""}`} href="/">
      <span className="brand-mark">Q</span>
      Quiz-BSI
    </Link>
  );
}
