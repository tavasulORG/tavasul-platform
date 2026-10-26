"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, HandCoins, RefreshCw, Search } from "lucide-react";
import { adminApi, type Row } from "@/lib/adminClient";
import { Alert, Badge, Button, Card, EmptyState, Input, Loading, PageHeader, Select, Stat, Table, Td, Th, errorMessage, fmtDate, fmtMoney, fmtNumber } from "@/components/admin/ui";

const METHOD_LABEL: Record<string, string> = { card: "بطاقة", bank_transfer: "حوالة بنكية" };

function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export default function AdminDonationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [method, setMethod] = useState("");
  const [currency, setCurrency] = useState("");
  const [range, setRange] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminApi.list("donations", { limit: 2000 });
      setRows(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const since = range === "all" ? null : new Date(Date.now() - Number(range) * 24 * 60 * 60 * 1000).toISOString();
    return rows.filter((d) => {
      if (method && d.payment_method !== method) return false;
      if (currency && d.currency !== currency) return false;
      if (since && String(d.created_at) < since) return false;
      if (!q) return true;
      return `${d.donor_name} ${d.donor_email ?? ""} ${d.receipt_number} ${d.project_title ?? ""}`.toLowerCase().includes(q);
    });
  }, [rows, query, method, currency, range]);

  const totalUsd = visible.reduce((n, d) => n + Number(d.amount_usd ?? 0), 0);
  const currencies = Array.from(new Set(rows.map((d) => String(d.currency)))).sort();

  const exportCsv = () => {
    const header = ["receipt_number", "created_at", "donor_name", "donor_email", "donor_phone", "is_anonymous", "amount", "currency", "amount_usd", "project_title", "payment_method", "status"];
    const lines = [header.join(","), ...visible.map((d) => header.map((k) => csvEscape(d[k])).join(","))];
    const blob = new Blob([`﻿${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tawasul-donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="التبرعات"
        description="سجل التبرعات المسجلة عبر الموقع. التصدير يشمل النتائج المعروضة بعد التصفية."
        actions={
          <>
            <Button variant="outline" icon={RefreshCw} onClick={load} loading={loading}>
              تحديث
            </Button>
            <Button icon={Download} onClick={exportCsv} disabled={visible.length === 0}>
              تصدير CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="عدد العمليات المعروضة" value={fmtNumber(visible.length)} icon={HandCoins} />
        <Stat label="الإجمالي بالدولار" value={fmtMoney(totalUsd)} tone="green" />
        <Stat label="متوسط التبرع" value={fmtMoney(visible.length ? totalUsd / visible.length : 0)} tone="amber" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block flex-1 min-w-[220px] max-w-md">
          <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو رقم الإيصال أو المشروع..." className="ps-9" />
        </label>
        <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-auto">
          <option value="all">كل الفترات</option>
          <option value="7">آخر 7 أيام</option>
          <option value="30">آخر 30 يوماً</option>
          <option value="90">آخر 90 يوماً</option>
          <option value="365">آخر سنة</option>
        </Select>
        <Select value={method} onChange={(e) => setMethod(e.target.value)} className="w-auto">
          <option value="">كل طرق الدفع</option>
          <option value="card">بطاقة</option>
          <option value="bank_transfer">حوالة بنكية</option>
        </Select>
        <Select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-auto">
          <option value="">كل العملات</option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading ? (
        <Loading />
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState icon={HandCoins} title="لا تبرعات" description={rows.length === 0 ? "تُسجَّل التبرعات هنا تلقائياً عند إتمامها من الموقع." : "لا نتائج مطابقة للتصفية."} />
        </Card>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>الإيصال</Th>
              <Th>التاريخ</Th>
              <Th>المتبرع</Th>
              <Th>المشروع</Th>
              <Th>المبلغ</Th>
              <Th>بالدولار</Th>
              <Th>الطريقة</Th>
              <Th>الحالة</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/70">
                <Td>
                  <span className="font-latin text-xs font-bold" dir="ltr">
                    {d.receipt_number}
                  </span>
                </Td>
                <Td className="whitespace-nowrap text-xs">{fmtDate(d.created_at)}</Td>
                <Td>
                  <div className="font-bold text-slate-900">{d.is_anonymous ? "فاعل خير" : d.donor_name}</div>
                  <div className="text-[11px] text-slate-500 font-latin" dir="ltr">
                    {d.donor_email}
                    {d.donor_phone ? ` · ${d.donor_phone}` : ""}
                  </div>
                </Td>
                <Td className="max-w-[220px] truncate text-xs">{d.project_title ?? "صندوق التبرع العام"}</Td>
                <Td>
                  <span className="font-latin font-bold" dir="ltr">
                    {fmtNumber(d.amount)} {d.currency}
                  </span>
                </Td>
                <Td>
                  <span className="font-latin text-xs" dir="ltr">
                    {fmtMoney(d.amount_usd)}
                  </span>
                </Td>
                <Td>
                  <Badge>{METHOD_LABEL[d.payment_method] ?? d.payment_method}</Badge>
                </Td>
                <Td>
                  <Badge tone={d.status === "success" ? "green" : "amber"}>{d.status === "success" ? "ناجح" : "معلّق"}</Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
