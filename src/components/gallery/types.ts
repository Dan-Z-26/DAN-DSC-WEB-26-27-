/**
 * Gallery Feature — Type Definitions
 * Developer Students Club • SRM IST Ramapuram
 */

/** Data shape for a single club activity. */
export interface ActivityData {
  /** Unique identifier used as a stable React key. */
  id: string;

  /**
   * URL segment for the activity's detail page.
   * Example: "hackcelerate" resolves to /gallery/hackcelerate
   */
  slug: string;

  /** Primary heading displayed on the squircle and the detail page. */
  title: string;

  /** One-line summary shown beneath the squircle on the spiral. */
  blurb: string;

  /** Full description rendered on the detail page. */
  description: string;

  /**
   * Absolute public path to the activity photograph.
   * Example: "/gallery/hackathon.png"
   */
  imagePath: string;

  /** Human-readable date string displayed on the detail page. */
  date: string;

  /** Short uppercase category label shown in the comic callout badge. */
  tag: string;

  /** When true, the squircle renders a "NEW!" callout badge. */
  isNew?: boolean;

  /** Headline figures shown as a row of panels on the detail page. */
  stats: ActivityStat[];

  /** What actually happens, as numbered comic panels. */
  highlights: ActivityHighlight[];

  /** Pull quote closing the detail page. */
  quote: ActivityQuote;
}

/** A single headline figure. */
export interface ActivityStat {
  /** The figure itself, e.g. "36" or "120+". */
  value: string;
  /** What the figure counts, e.g. "hours". */
  label: string;
}

/** One beat in the run of an activity. */
export interface ActivityHighlight {
  title: string;
  body: string;
}

/** Attributed pull quote. */
export interface ActivityQuote {
  text: string;
  attribution: string;
}
