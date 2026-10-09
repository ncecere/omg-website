"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

type Props = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Shown under the enlarged image; omit for none. */
  caption?: string;
  /** The in-page <img>, rendered by the server component (components/Screenshot.tsx). */
  children: ReactNode;
};

/**
 * Click-to-enlarge for a screenshot. It wraps the in-page image in a button and
 * owns a native <dialog> (showModal: focus trap, Esc to close, inert page
 * behind). The enlarged image mounts on first open, from the same same-origin
 * file. Clicking it toggles fit / actual size; the backdrop, Esc and the Close
 * button close it. Page scroll is locked by the `html:has(dialog[data-zoom][open])`
 * rule in app/globals.css. No third-party requests, nothing stored.
 */
export function ScreenshotZoom({ src, width, height, alt, caption, children }: Props) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const anchor = useRef({ x: 0.5, y: 0 });
  const [open, setOpen] = useState(false);
  const [actual, setActual] = useState(false);

  // Mount the contents first, then open the dialog (so focus lands on Close).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  // After switching to actual size, scroll to the point that was clicked.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const img = imgRef.current;
    if (!actual || !scroller || !img) return;
    const { x, y } = anchor.current;
    scroller.scrollLeft = img.offsetLeft + x * img.offsetWidth - scroller.clientWidth / 2;
    scroller.scrollTop = img.offsetTop + y * img.offsetHeight - scroller.clientHeight / 2;
  }, [actual]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // Fired for Esc, the Close button and the backdrop alike.
  const onClose = useCallback(() => {
    setOpen(false);
    setActual(false);
    triggerRef.current?.focus();
  }, []);

  const toggle = useCallback((point?: { x: number; y: number }) => {
    anchor.current = point ?? { x: 0.5, y: 0 };
    setActual((v) => !v);
  }, []);

  const onImageClick = (e: MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggle(
      e.detail === 0 ? undefined : { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height },
    );
  };

  // Clicks on the dim area (the dialog itself or any [data-backdrop] strip) close it.
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.hasAttribute("data-backdrop")) close();
  };

  // Largest size that fits the viewport, never upscaled, aspect ratio kept.
  const reserved = caption ? "10rem" : "6.5rem";
  const fitWidth = `min(${width}px, calc(100vw - 2rem), calc((100dvh - ${reserved}) * ${width / height}))`;

  const control =
    "rounded-control border border-brand-border-strong bg-brand-surface-raised px-3 py-1.5 text-sm font-medium text-brand-text hover:bg-brand-surface-hover";

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Enlarge screenshot: ${alt}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in focus-visible:outline-offset-[-4px]"
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-md border border-brand-border-strong bg-brand-surface-raised/90 text-brand-text opacity-70 shadow-brand-1 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        data-zoom=""
        aria-label={alt}
        onClose={onClose}
        onClick={onDialogClick}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 bg-brand-bg/90 p-0 text-brand-text backdrop-blur-sm"
      >
        {open ? (
          <div className="flex h-full w-full flex-col">
            <div data-backdrop="" className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
              <button type="button" onClick={() => toggle()} aria-pressed={actual} className={control}>
                {actual ? "Fit to screen" : "Actual size"}
              </button>
              <button ref={closeRef} type="button" onClick={close} className={`inline-flex items-center gap-1.5 ${control}`}>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
                Close
              </button>
            </div>

            <div
              ref={scrollerRef}
              data-backdrop=""
              tabIndex={actual ? 0 : undefined}
              role={actual ? "region" : undefined}
              aria-label={actual ? `Enlarged screenshot, scrollable: ${alt}` : undefined}
              className="flex min-h-0 flex-1 overflow-auto overscroll-contain px-4 pb-2"
            >
              {/* m-auto centres the image when it is smaller than the pane and still lets a larger one scroll. */}
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                decoding="async"
                onClick={onImageClick}
                style={{ width: actual ? `${width}px` : fitWidth, height: "auto" }}
                className={`m-auto block max-w-none shrink-0 rounded-card border border-brand-border-emphasis bg-brand-surface object-contain shadow-brand-3 ${
                  actual ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
              />
            </div>

            {caption ? (
              <p data-backdrop="" className="shrink-0 px-4 pt-1 pb-4 text-center text-sm text-brand-muted">
                <span className="mx-auto block max-w-prose">{caption}</span>
              </p>
            ) : (
              <div data-backdrop="" className="h-3 shrink-0" />
            )}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
