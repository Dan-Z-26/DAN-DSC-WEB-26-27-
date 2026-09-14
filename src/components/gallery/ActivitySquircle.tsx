/**
 * ActivitySquircle
 * Developer Students Club • SRM IST Ramapuram
 *
 * One activity on the gallery spiral.
 *
 * TRANSFORM OWNERSHIP — each nested layer owns exactly one transform so the
 * effects compose instead of overwriting each other:
 *   .activity-slot   translate  — spiral position   (written by GallerySpiral)
 *   .activity-tilt   rotate     — comic panel tilt  (CSS, static)
 *   .activity-media  scale      — hover zoom        (CSS transition)
 * Collapsing these onto one element would make the last write win and
 * silently erase the others.
 */

import type { ActivityData } from './types';

/**
 * Deterministic tilt sequence. A random angle per render would reshuffle the
 * whole spiral on every re-render, so the tilt is derived from the index.
 */
const TILT_SEQUENCE = [-1.4, 1.2, -0.7, 1.5, -1.1, 0.9];

interface Props {
  activity: ActivityData;
  index?: number;
}

export default function ActivitySquircle({ activity, index = 0 }: Props) {
  const { slug, title, blurb, imagePath, tag, isNew } = activity;

  const tilt = TILT_SEQUENCE[index % TILT_SEQUENCE.length];

  return (
    <a
      href={`/gallery/${slug}`}
      className="activity-slot"
      data-spiral-item
      data-index={index}
      style={{ '--slot-tilt': `${tilt}deg` } as React.CSSProperties}
    >
      <div className="activity-tilt">
        <div className="activity-frame">
          <div className="activity-media">
            <img
              src={imagePath}
              alt=""
              className="activity-img"
              loading="lazy"
              decoding="async"
            />
          </div>

          <span className="activity-halftone" aria-hidden="true" />
        </div>

        <span className="activity-badge activity-badge--tag">{tag}</span>

        {isNew && (
          <span className="activity-badge activity-badge--new" aria-hidden="true">
            New!
          </span>
        )}

        {/* Comic caption box, overlaid on the panel rather than sitting below
            it — on a tight coil, copy placed underneath lands on whichever
            item comes next. */}
        <span className="activity-caption">
          <span className="activity-title">{title}</span>
          <span className="activity-blurb">{blurb}</span>
        </span>
      </div>
    </a>
  );
}
