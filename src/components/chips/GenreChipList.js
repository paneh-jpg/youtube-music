// src/components/chips/GenreChipList.js
import { GenreColorChip } from "./GenreChip";

export function GenreChipList({ items = [] } = {}) {
  return `
    <div class="space-y-3">
      ${items
        .map((g) =>
          GenreColorChip({
            label: g.name,
            color: g.color,
            slug: g.slug,
          })
        )
        .join("")}
    </div>
  `;
}
