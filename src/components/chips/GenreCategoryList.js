// src/components/chips/GenreChipList.js
import { GenreColorCate } from "./GenreCategory";

export function GenreCateList({ items = [] } = {}) {
  return `
    <div class="space-y-3">
      ${items
        .map((g) =>
          GenreColorCate({
            label: g.name,
            color: g.color,
            slug: g.slug,
          })
        )
        .join("")}
    </div>
  `;
}
