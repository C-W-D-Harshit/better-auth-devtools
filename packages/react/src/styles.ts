import type { CSSProperties } from "react";

/*
 * Better Auth DevTools — refined dark theme
 * Palette: deep charcoal base, warm amber accent (#f59e0b),
 * cool slate surfaces, crisp white text.
 */

const ACCENT = "#f59e0b";
const ACCENT_DIM = "rgba(245,158,11,0.12)";
const ACCENT_BORDER = "rgba(245,158,11,0.25)";
const BG_BASE = "#0c0c0f";
const BG_ELEVATED = "#141418";
const BG_SURFACE = "#1c1c22";
const BG_INSET = "#111115";
const BORDER = "rgba(255,255,255,0.06)";
const BORDER_STRONG = "rgba(255,255,255,0.1)";
const TEXT_PRIMARY = "#f0f0f2";
const TEXT_SECONDARY = "#8b8b96";
const TEXT_MUTED = "#55555e";
const RADIUS_SM = "6px";
const RADIUS_MD = "10px";
const RADIUS_LG = "14px";
const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const SHADOW_PANEL =
  "0 24px 80px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)";
const SHADOW_TRIGGER =
  "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)";

export const styles: Record<string, CSSProperties> = {
  /* ── Layout ─────────────────────────────────── */
  container: {
    position: "fixed",
    zIndex: 99999,
    fontFamily: FONT_SANS,
    fontSize: "13px",
    lineHeight: "1.5",
    WebkitFontSmoothing: "antialiased" as CSSProperties["WebkitFontSmoothing"],
  },

  /* ── Trigger button ─────────────────────────── */
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: `linear-gradient(135deg, ${BG_ELEVATED} 0%, ${BG_BASE} 100%)`,
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER_STRONG}`,
    borderRadius: "12px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: FONT_SANS,
    letterSpacing: "0.2px",
    boxShadow: SHADOW_TRIGGER,
    transition: "all 0.2s ease",
  },
  triggerIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    background: ACCENT,
    flexShrink: 0,
  },

  /* ── Panel ──────────────────────────────────── */
  panel: {
    width: "380px",
    maxHeight: "560px",
    overflowY: "auto" as const,
    background: BG_BASE,
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER}`,
    borderRadius: RADIUS_LG,
    boxShadow: SHADOW_PANEL,
  },

  /* ── Header ─────────────────────────────────── */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderBottom: `1px solid ${BORDER}`,
    background: BG_ELEVATED,
    borderTopLeftRadius: RADIUS_LG,
    borderTopRightRadius: RADIUS_LG,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  headerIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    background: ACCENT,
    flexShrink: 0,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: "13px",
    color: TEXT_PRIMARY,
    letterSpacing: "0.1px",
  },
  headerBadge: {
    fontSize: "9px",
    fontWeight: 600,
    color: ACCENT,
    background: ACCENT_DIM,
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: "4px",
    padding: "1px 6px",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    fontFamily: FONT_MONO,
  },
  closeButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: TEXT_SECONDARY,
    border: "none",
    cursor: "pointer",
    width: "28px",
    height: "28px",
    borderRadius: RADIUS_SM,
    fontSize: "16px",
    fontFamily: FONT_SANS,
    transition: "all 0.15s ease",
  },

  /* ── Sections ───────────────────────────────── */
  section: {
    padding: "14px 18px",
    borderBottom: `1px solid ${BORDER}`,
  },
  sectionTitle: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    color: TEXT_MUTED,
    marginBottom: "10px",
    letterSpacing: "1px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: FONT_SANS,
  },

  /* ── Template buttons ───────────────────────── */
  templateGrid: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap" as const,
  },
  templateButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: ACCENT_DIM,
    color: ACCENT,
    border: `1px solid ${ACCENT_BORDER}`,
    borderRadius: RADIUS_SM,
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 500,
    fontFamily: FONT_SANS,
    transition: "all 0.15s ease",
  },

  /* ── Search ─────────────────────────────────── */
  searchInput: {
    width: "100%",
    background: BG_INSET,
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER_STRONG}`,
    borderRadius: RADIUS_SM,
    padding: "8px 12px",
    fontSize: "12px",
    marginBottom: "10px",
    fontFamily: FONT_MONO,
    boxSizing: "border-box" as const,
    outline: "none",
    transition: "border-color 0.15s ease",
  },

  /* ── User list ──────────────────────────────── */
  userList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    background: BG_SURFACE,
    borderRadius: RADIUS_SM,
    border: `1px solid transparent`,
    transition: "all 0.15s ease",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userLabel: {
    fontWeight: 600,
    color: TEXT_PRIMARY,
    fontSize: "12px",
    fontFamily: FONT_SANS,
  },
  userEmail: {
    color: TEXT_SECONDARY,
    fontSize: "11px",
    fontFamily: FONT_MONO,
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    marginTop: "1px",
  },
  loginButton: {
    background: `linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)`,
    color: "#fff",
    border: "none",
    borderRadius: RADIUS_SM,
    padding: "5px 14px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    fontFamily: FONT_SANS,
    marginLeft: "10px",
    flexShrink: 0,
    transition: "all 0.15s ease",
    boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
  },

  /* ── Session inspector ──────────────────────── */
  sessionFields: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "3px",
    background: BG_INSET,
    borderRadius: RADIUS_MD,
    padding: "6px",
    border: `1px solid ${BORDER}`,
  },
  fieldRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "5px 8px",
    borderRadius: "4px",
    transition: "background 0.1s ease",
  },
  fieldKey: {
    color: "#7dd3fc",
    fontWeight: 500,
    fontFamily: FONT_MONO,
    fontSize: "11px",
  },
  fieldValue: {
    color: "#d1d5db",
    textAlign: "right" as const,
    maxWidth: "55%",
    overflow: "hidden" as const,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    fontFamily: FONT_MONO,
    fontSize: "11px",
  },

  /* ── Edit session form ──────────────────────── */
  editFieldRow: {
    marginBottom: "10px",
  },
  editFieldLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    color: TEXT_SECONDARY,
    marginBottom: "5px",
    fontFamily: FONT_SANS,
  },
  editInput: {
    width: "100%",
    background: BG_INSET,
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER_STRONG}`,
    borderRadius: RADIUS_SM,
    padding: "7px 10px",
    fontSize: "12px",
    fontFamily: FONT_MONO,
    boxSizing: "border-box" as const,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  saveButton: {
    width: "100%",
    background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
    color: "#fff",
    border: "none",
    borderRadius: RADIUS_SM,
    padding: "9px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: FONT_SANS,
    marginTop: "4px",
    transition: "all 0.15s ease",
    boxShadow: "0 1px 3px rgba(5,150,105,0.3)",
  },

  /* ── Utilities ──────────────────────────────── */
  refreshButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "transparent",
    color: TEXT_SECONDARY,
    border: "none",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 500,
    fontFamily: FONT_SANS,
    padding: "2px 6px",
    borderRadius: "4px",
    transition: "color 0.15s ease",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.08)",
    color: "#fca5a5",
    padding: "10px 18px",
    fontSize: "12px",
    borderBottom: `1px solid rgba(239,68,68,0.15)`,
    fontFamily: FONT_SANS,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: "12px",
    fontFamily: FONT_SANS,
  },
  muted: {
    color: TEXT_MUTED,
    fontSize: "12px",
    fontStyle: "normal" as const,
    fontFamily: FONT_SANS,
    padding: "4px 0",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "16px 8px",
    color: TEXT_MUTED,
    fontSize: "12px",
    fontFamily: FONT_SANS,
  },
  statusDot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 6px rgba(34,197,94,0.4)",
    marginLeft: "6px",
  },
  statusDotInactive: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: TEXT_MUTED,
    marginLeft: "6px",
  },
};
