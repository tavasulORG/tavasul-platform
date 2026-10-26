"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAdminShell } from "./AdminShell";

/* ----------------------------------------------------------------------------
 * Draft state of an editor: the working copy, whether it differs from the saved
 * record, a localStorage backup that survives a refresh, and Ctrl+S.
 * ------------------------------------------------------------------------- */

const STORAGE_PREFIX = "tawasul-admin-draft:";

export interface Draft<T> {
  draft: T;
  setDraft: (next: T | ((current: T) => T)) => void;
  dirty: boolean;
  /** Replaces both the saved baseline and the draft (after a load or a save). */
  reset: (saved: T) => void;
  /** Marks the current draft as saved. */
  markSaved: () => void;
  /** Drops the draft back to the saved baseline. */
  discard: () => void;
  /** A backup from a previous session exists and differs from the saved record. */
  backup: T | null;
  restoreBackup: () => void;
  dropBackup: () => void;
}

function stable(value: unknown): string {
  return JSON.stringify(value);
}

function readBackup<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeBackup(key: string, value: unknown) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the in-memory draft still works.
  }
}

function clearBackup(key: string) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // ignore
  }
}

/**
 * @param key   unique id of the record being edited (table + id), used for the backup
 * @param saved the record as stored; pass null while it is still loading
 * @param onSave invoked by Ctrl+S when the draft is dirty
 */
export function useDraft<T>(key: string, saved: T | null, onSave?: () => void): Draft<T> {
  const { setDirty } = useAdminShell();
  const [baseline, setBaseline] = useState<T | null>(saved);
  const [draft, setDraftState] = useState<T | null>(saved);
  const [backup, setBackup] = useState<T | null>(null);
  const loadedKey = useRef<string | null>(null);

  // Adopt the saved record once it arrives (or when the key changes), and look for a backup.
  useEffect(() => {
    if (saved === null) return;
    if (loadedKey.current === key) return;
    loadedKey.current = key;
    setBaseline(saved);
    setDraftState(saved);
    const stored = readBackup<T>(key);
    setBackup(stored && stable(stored) !== stable(saved) ? stored : null);
  }, [key, saved]);

  const dirty = useMemo(() => baseline !== null && draft !== null && stable(baseline) !== stable(draft), [baseline, draft]);

  useEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  // Backup the draft (debounced) while it differs from the saved record.
  useEffect(() => {
    if (!dirty || draft === null) return;
    const timer = setTimeout(() => writeBackup(key, draft), 400);
    return () => clearTimeout(timer);
  }, [dirty, draft, key]);

  const setDraft = useCallback((next: T | ((current: T) => T)) => {
    setDraftState((current) => {
      if (current === null) return current;
      return typeof next === "function" ? (next as (c: T) => T)(current) : next;
    });
  }, []);

  const reset = useCallback(
    (next: T) => {
      setBaseline(next);
      setDraftState(next);
      setBackup(null);
      clearBackup(key);
    },
    [key]
  );

  const markSaved = useCallback(() => {
    setDraftState((current) => {
      if (current !== null) setBaseline(current);
      return current;
    });
    setBackup(null);
    clearBackup(key);
  }, [key]);

  const discard = useCallback(() => {
    if (baseline !== null) setDraftState(baseline);
    setBackup(null);
    clearBackup(key);
  }, [baseline, key]);

  const restoreBackup = useCallback(() => {
    if (backup !== null) setDraftState(backup);
    setBackup(null);
  }, [backup]);

  const dropBackup = useCallback(() => {
    setBackup(null);
    clearBackup(key);
  }, [key]);

  // Ctrl+S / Cmd+S saves.
  useEffect(() => {
    if (!onSave) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (dirty) onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSave, dirty]);

  return {
    draft: (draft ?? saved ?? ({} as T)) as T,
    setDraft,
    dirty,
    reset,
    markSaved,
    discard,
    backup,
    restoreBackup,
    dropBackup,
  };
}
