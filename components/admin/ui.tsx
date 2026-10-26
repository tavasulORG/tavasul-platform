"use client";

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Loader2, X, XCircle, type LucideIcon } from "lucide-react";

/* ----------------------------------------------------------------------------
 * Small UI kit of the admin panel: brand cyan on white and slate, no motion
 * beyond short fades. Everything is RTL-aware through logical utilities.
 * ------------------------------------------------------------------------- */

export const cn = clsx;

export const numberFormat = new Intl.NumberFormat("en-US");

export function fmtNumber(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return numberFormat.format(Number.isFinite(n) ? n : 0);
}

export function fmtMoney(value: number | string | null | undefined, currency = "USD"): string {
  const n = Number(value ?? 0);
  return `${numberFormat.format(Math.round(Number.isFinite(n) ? n : 0))} ${currency}`;
}

export function fmtDate(value: string | null | undefined, withTime = true): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    numberingSystem: "latn",
  }).format(date);
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* Buttons */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/20 disabled:bg-primary-300",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400",
  outline: "bg-white text-slate-700 border border-slate-300 hover:border-primary-400 hover:text-primary-700 disabled:text-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, icon: Icon, className, children, disabled, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-bold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed",
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
      {children}
    </button>
  );
});

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
  external?: boolean;
}

export function LinkButton({ href, variant = "outline", size = "md", icon: Icon, className, children, external }: LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-bold whitespace-nowrap transition-colors",
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    className
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );
}

/* Form controls */

const CONTROL =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-50 disabled:text-slate-500";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, ...props }, ref) {
  return <input ref={ref} className={cn(CONTROL, "h-10", invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/20", className)} {...props} />;
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(CONTROL, "py-2.5 leading-relaxed resize-y", invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/20", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(CONTROL, "h-10 cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
});

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer select-none", disabled && "opacity-60 cursor-not-allowed")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
          checked ? "bg-primary-500" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[inset-inline-start]",
            checked ? "start-[22px]" : "start-0.5"
          )}
        />
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-bold text-slate-800">{label}</span>}
          {description && <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</span>}
        </span>
      )}
    </label>
  );
}

interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
  /** Small label beside the control, e.g. the language code. */
  badge?: ReactNode;
}

export function Field({ label, hint, error, required, children, className, badge }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700">
            {label}
            {required && <span className="text-red-500 ms-1">*</span>}
          </span>
          {badge}
        </div>
      )}
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : hint ? <p className="text-xs text-slate-500 leading-relaxed">{hint}</p> : null}
    </div>
  );
}

/* Surfaces */

interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  icon?: LucideIcon;
}

export function Card({ title, description, actions, children, className, bodyClassName, icon: Icon }: CardProps) {
  return (
    <section className={cn("min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="w-4.5 h-4.5" />
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>}
              {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

type Tone = "slate" | "cyan" | "green" | "amber" | "red" | "violet";

const BADGE_TONE: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700",
  cyan: "bg-primary-50 text-primary-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  violet: "bg-violet-50 text-violet-700",
};

export function Badge({ tone = "slate", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap", BADGE_TONE[tone], className)}>
      {children}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("w-5 h-5 animate-spin text-primary-500", className)} />;
}

export function Loading({ label = "جارٍ التحميل..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
      <Spinner />
      {label}
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon = Info, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-14 px-6", className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon className="w-6 h-6" />
      </span>
      <h3 className="mt-4 text-sm font-extrabold text-slate-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const ALERT_TONE: Record<"info" | "success" | "warning" | "error", { box: string; icon: LucideIcon }> = {
  info: { box: "bg-primary-50 border-primary-200 text-primary-900", icon: Info },
  success: { box: "bg-emerald-50 border-emerald-200 text-emerald-900", icon: CheckCircle2 },
  warning: { box: "bg-amber-50 border-amber-200 text-amber-900", icon: AlertTriangle },
  error: { box: "bg-red-50 border-red-200 text-red-900", icon: XCircle },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  actions,
}: {
  tone?: keyof typeof ALERT_TONE;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const { box, icon: Icon } = ALERT_TONE[tone];
  return (
    <div className={cn("flex gap-3 rounded-2xl border px-4 py-3.5 text-sm", box, className)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-extrabold">{title}</p>}
        {children && <div className="text-[13px] leading-relaxed opacity-90">{children}</div>}
        {actions && <div className="pt-2 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* Page scaffolding */

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
  className?: string;
}

export function PageHeader({ title, description, actions, back, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 mb-2">
            <ArrowRight className="w-3.5 h-3.5" />
            {back.label}
          </Link>
        )}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-brand">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: LucideIcon;
  count?: number;
}

export function Tabs({ tabs, value, onChange, className }: { tabs: TabItem[]; value: string; onChange: (id: string) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1", className)}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
              active ? "bg-white text-primary-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("rounded-full px-1.5 text-[10px] font-latin", active ? "bg-primary-50" : "bg-slate-200")}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface StatProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
}

export function Stat({ label, value, hint, icon: Icon, tone = "cyan" }: StatProps) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        {Icon && (
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", BADGE_TONE[tone])}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-black text-slate-900 font-latin tabular-nums" dir="ltr">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

/* Tables */

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-slate-200 bg-white", className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return <th className={cn("bg-slate-50 px-4 py-3 text-start text-[11px] font-bold text-slate-500 whitespace-nowrap", className)}>{children}</th>;
}

export function Td({ children, className, colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={cn("border-t border-slate-100 px-4 py-3 align-middle text-slate-700", className)}>
      {children}
    </td>
  );
}

/* Modal, confirm */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const MODAL_SIZE = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-3xl", xl: "max-w-5xl" };

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn" dir="rtl">
      <button type="button" aria-label="إغلاق" className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl",
          MODAL_SIZE[size]
        )}
      >
        {(title || description) && (
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <div className="min-w-0">
              {title && <h2 className="text-base font-extrabold text-slate-900">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
          </header>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-3.5">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  danger,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message && <p className="text-sm text-slate-600 leading-relaxed">{message}</p>}
    </Modal>
  );
}

/* Toasts */

type ToastTone = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_TONE: Record<ToastTone, { box: string; icon: LucideIcon }> = {
  success: { box: "border-emerald-200 bg-white text-emerald-800", icon: CheckCircle2 },
  error: { box: "border-red-200 bg-white text-red-800", icon: XCircle },
  info: { box: "border-primary-200 bg-white text-primary-800", icon: Info },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const toast = useCallback((input: ToastInput) => {
    const id = ++counter.current;
    setItems((current) => [...current, { id, tone: "info", ...input }]);
    setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), input.tone === "error" ? 7000 : 4000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 start-4 z-[90] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" dir="rtl">
        {items.map((item) => {
          const { box, icon: Icon } = TOAST_TONE[item.tone ?? "info"];
          return (
            <div key={item.id} className={cn("pointer-events-auto flex gap-3 rounded-2xl border px-4 py-3 shadow-lg animate-fadeIn", box)}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{item.title}</p>
                {item.description && <p className="mt-0.5 text-xs text-slate-600 leading-relaxed break-words">{item.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setItems((current) => current.filter((i) => i.id !== item.id))}
                className="self-start rounded-md p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

/** "خطأ ما" from any thrown value. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
