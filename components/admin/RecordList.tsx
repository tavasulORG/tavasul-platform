"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil, Plus, Search } from "lucide-react";
import type { ListOptions, Row } from "@/lib/adminClient";
import { adminApi } from "@/lib/adminClient";
import { useContent } from "@/context/ContentContext";
import { useAdminList } from "./useRecords";
import { Alert, Button, EmptyState, Input, LinkButton, Loading, PageHeader, Table, Td, Th, cn, errorMessage, useToast } from "./ui";

/* ----------------------------------------------------------------------------
 * Generic list of a content table with search, manual ordering and edit links.
 * ------------------------------------------------------------------------- */

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T, row: Row) => ReactNode;
  className?: string;
}

export interface RecordListConfig<T extends { id: string }> {
  table: string;
  listOptions?: ListOptions;
  title: string;
  description?: string;
  /** Singular label for the "add" button, e.g. "مجال". */
  label: string;
  editHref: (item: T) => string;
  createHref: string;
  fromRow: (row: Row) => T;
  columns: Column<T>[];
  /** Text searched by the search box. */
  searchText: (item: T) => string;
  /** Column holding the manual order; omit to disable reordering. */
  sortColumn?: string;
  emptyText?: string;
}

export function RecordList<T extends { id: string }>({ config, toolbar }: { config: RecordListConfig<T>; toolbar?: ReactNode }) {
  const { toast } = useToast();
  const { refresh } = useContent();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const { rows, items, loading, error, reload } = useAdminList<T>(config.table, config.fromRow, config.listOptions);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.map((item, index) => ({ item, row: rows[index] }));
    return q ? list.filter(({ item }) => config.searchText(item).toLowerCase().includes(q)) : list;
  }, [items, rows, query, config]);

  const move = async (index: number, direction: -1 | 1) => {
    if (!config.sortColumn) return;
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const column = config.sortColumn;
    // Renumber by the displayed order with the two rows swapped; only rows whose number changes are written.
    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const changes = reordered
      .map((row, i) => ({ id: String(row.id), order: i + 1, current: Number(row[column]) }))
      .filter((c) => c.current !== c.order);
    setBusy(true);
    try {
      for (const change of changes) {
        await adminApi.update(config.table, change.id, { [column]: change.order }, "تغيير الترتيب");
      }
      await reload();
      void refresh();
    } catch (err) {
      toast({ tone: "error", title: "تعذر تغيير الترتيب", description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <>
            {toolbar}
            <LinkButton href={config.createHref} variant="primary" icon={Plus}>
              إضافة {config.label}
            </LinkButton>
          </>
        }
      />

      <label className="relative block max-w-md">
        <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث..." className="ps-9" />
      </label>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : visible.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? `لا توجد ${config.title} بعد` : "لا نتائج"}
          description={items.length === 0 ? config.emptyText ?? "استورد المحتوى الافتراضي من لوحة المعلومات أو أضف سجلاً جديداً." : "جرّب كلمة بحث أخرى."}
          action={
            items.length === 0 ? (
              <LinkButton href={config.createHref} variant="primary" icon={Plus}>
                إضافة {config.label}
              </LinkButton>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <thead>
            <tr>
              {config.sortColumn && <Th className="w-16">ترتيب</Th>}
              {config.columns.map((column) => (
                <Th key={column.key} className={column.className}>
                  {column.label}
                </Th>
              ))}
              <Th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {visible.map(({ item, row }) => {
              const index = rows.indexOf(row);
              return (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  {config.sortColumn && (
                    <Td>
                      <div className={cn("flex flex-col items-center", query && "opacity-40 pointer-events-none")}>
                        <button type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} className="rounded p-0.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30">
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-latin text-slate-400">{index + 1}</span>
                        <button type="button" disabled={busy || index === rows.length - 1} onClick={() => move(index, 1)} className="rounded p-0.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  )}
                  {config.columns.map((column) => (
                    <Td key={column.key} className={column.className}>
                      {column.render(item, row)}
                    </Td>
                  ))}
                  <Td>
                    <Link href={config.editHref(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-primary-400 hover:text-primary-700">
                      <Pencil className="w-3.5 h-3.5" />
                      تعديل
                    </Link>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {busy && (
        <div className="text-xs text-slate-500">
          <Button size="sm" variant="ghost" loading>
            جارٍ الحفظ...
          </Button>
        </div>
      )}
    </div>
  );
}

/** Small photo cell used by several lists. */
export function Thumb({ src, className }: { src?: string; className?: string }) {
  return (
    <span className={cn("block h-12 w-16 overflow-hidden rounded-lg bg-slate-100", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : null}
    </span>
  );
}
