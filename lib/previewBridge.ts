"use client";

import { useSyncExternalStore } from "react";
import type {
  BankAccount,
  CountryRegion,
  HomeContent,
  Language,
  OrganizationInfo,
  Project,
  Sector,
  SiteSettings,
} from "@/types";

/**
 * Live preview bridge between the admin editors and the public site.
 *
 * The admin embeds a site page in an iframe with ?preview=1 and posts the unsaved
 * draft to it. The site's providers (language, content, donation) read the
 * overrides from this store and render the draft instead of the saved data.
 * Only messages from the same origin are accepted.
 */

export const PREVIEW_PARAM = "preview";
export const PREVIEW_MESSAGE = "tawasul:preview";
export const PREVIEW_READY = "tawasul:preview-ready";

export interface PreviewOverrides {
  translations?: Partial<Record<Language, Record<string, string>>>;
  sectors?: Sector[];
  regions?: CountryRegion[];
  /** Replaces projects with the same id and appends new ones. */
  projects?: Project[];
  bankAccounts?: BankAccount[];
  about?: OrganizationInfo;
  settings?: SiteSettings;
  home?: HomeContent;
}

export interface PreviewMessage {
  type: typeof PREVIEW_MESSAGE;
  overrides?: PreviewOverrides;
  language?: Language;
  /** Element id to scroll into view after the draft is applied. */
  scrollTo?: string;
}

interface PreviewState {
  active: boolean;
  overrides: PreviewOverrides;
  language: Language | null;
  scrollTo: string | null;
}

const INACTIVE: PreviewState = { active: false, overrides: {}, language: null, scrollTo: null };

let state: PreviewState = INACTIVE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** True when this document is the preview iframe inside the admin. */
export function isPreviewWindow(): boolean {
  if (typeof window === "undefined") return false;
  if (window.self === window.top) return false;
  return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === "1";
}

/** Starts listening to the admin's messages. Returns a cleanup function. Safe to call once per page. */
export function startPreviewListener(): () => void {
  if (!isPreviewWindow()) return () => {};

  const onMessage = (event: MessageEvent<PreviewMessage>) => {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || data.type !== PREVIEW_MESSAGE) return;
    state = {
      active: true,
      overrides: data.overrides ? { ...state.overrides, ...data.overrides } : state.overrides,
      language: data.language ?? state.language,
      scrollTo: data.scrollTo ?? null,
    };
    emit();
  };

  window.addEventListener("message", onMessage);
  state = { ...INACTIVE, active: true };
  emit();
  window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);

  return () => window.removeEventListener("message", onMessage);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => INACTIVE;

/** The current preview state; inactive (empty overrides) on the public site and on the server. */
export function usePreview(): PreviewState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Posts a draft to a preview iframe. */
export function postPreview(frame: HTMLIFrameElement | null, message: Omit<PreviewMessage, "type">) {
  const target = frame?.contentWindow;
  if (!target) return;
  target.postMessage({ type: PREVIEW_MESSAGE, ...message } satisfies PreviewMessage, window.location.origin);
}

/** Builds the iframe URL of a site path in preview mode, keeping any #hash. */
export function previewUrl(path: string): string {
  const [pathAndQuery, hash] = path.split("#");
  const joiner = pathAndQuery.includes("?") ? "&" : "?";
  return `${pathAndQuery}${joiner}${PREVIEW_PARAM}=1${hash ? `#${hash}` : ""}`;
}
