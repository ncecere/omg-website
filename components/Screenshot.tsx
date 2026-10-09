import screenshots from "@/lib/screenshots.json";
import slots from "@/lib/slots.json";
import { Image as ImageIcon } from "./icons";
import { ScreenshotZoom } from "./ScreenshotZoom";

export type SlotName = keyof typeof slots;

type Slot = { alt: string; caption: string; file?: string; interimFile?: string; shape?: "phone" };
type Shot = { src: string; width: number; height: number; interim?: boolean };
const allSlots = slots as Record<SlotName, Slot>;
const available = screenshots as Record<string, Shot | undefined>;

type Props = {
  slot: SlotName;
  /** Load eagerly (the hero image); everything else is lazy. */
  priority?: boolean;
  caption?: boolean;
  className?: string;
};

/**
 * A named screenshot slot. When `npm run images` has copied the matching file
 * (public/images/<slot>.webp, listed in lib/screenshots.json), it renders the
 * image with its intrinsic size; otherwise a clearly marked placeholder that
 * names the file it expects. Phone slots render narrower, at a phone's shape.
 * An available image opens enlarged on click (ScreenshotZoom, the only client
 * component here); the <img> itself is still rendered on the server.
 */
export function Screenshot({ slot, priority = false, caption = true, className = "" }: Props) {
  const meta = allSlots[slot];
  const shot = available[slot];
  const phone = meta.shape === "phone";

  return (
    <figure className={`min-w-0 ${phone ? "mx-auto w-full max-w-[18rem]" : ""} ${className}`}>
      <div
        className={`overflow-hidden border border-brand-border-emphasis bg-brand-surface shadow-brand-3 ${
          phone ? "rounded-[1.75rem]" : "rounded-card"
        }`}
      >
        {shot ? (
          <ScreenshotZoom
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={meta.alt}
            caption={caption ? meta.caption : undefined}
          >
            <img
              src={shot.src}
              width={shot.width}
              height={shot.height}
              alt={meta.alt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              className="block h-auto w-full"
            />
          </ScreenshotZoom>
        ) : (
          <div
            role="img"
            aria-label={`Screenshot placeholder: ${meta.alt}`}
            data-missing-screenshot={`${meta.file ?? slot}.png`}
            className={`placeholder-stripes flex w-full flex-col items-center justify-center gap-3 p-6 text-center ${
              phone ? "aspect-[390/844]" : "aspect-[16/10]"
            }`}
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-brand-border-emphasis bg-brand-surface text-brand-text">
              <ImageIcon className="size-5" />
            </span>
            <span className="text-sm font-medium text-brand-text">Screenshot coming soon</span>
            <code className="rounded-xs bg-brand-surface px-2 py-0.5 font-mono text-xs break-all text-brand-muted ring-1 ring-brand-border-emphasis">
              {meta.file ?? slot}.png
            </code>
          </div>
        )}
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-brand-muted">{meta.caption}</figcaption> : null}
    </figure>
  );
}
