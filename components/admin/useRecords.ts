"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi, type ListOptions, type Row } from "@/lib/adminClient";
import { errorMessage } from "./ui";

/** Rows of a table, mapped to models, with reload. */
export function useAdminList<T>(table: string, fromRow: (row: Row) => T, options?: ListOptions, enabled = true) {
  const [rows, setRows] = useState<Row[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const optionsKey = JSON.stringify(options ?? {});

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.list(table, JSON.parse(optionsKey) as ListOptions);
      setRows(result.data);
      setCount(result.count);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [table, optionsKey, enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const items = useMemo(() => rows.map(fromRow), [rows, fromRow]);

  return { rows, items, count, loading, error, reload, setRows };
}

/** One row by primary key, mapped to a model; `null` while loading, `undefined` when missing. */
export function useAdminRecord<T>(table: string, id: string | null, fromRow: (row: Row) => T) {
  const [row, setRow] = useState<Row | null | undefined>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!id) {
      setRow(undefined);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.get(table, id);
      setRow(result.data ?? undefined);
    } catch (err) {
      setError(errorMessage(err));
      setRow(undefined);
    } finally {
      setLoading(false);
    }
  }, [table, id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const record = useMemo(() => (row ? fromRow(row) : row === null ? null : undefined), [row, fromRow]);

  return { row, record, loading, error, reload };
}
