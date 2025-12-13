import { GenreColorChip } from "./GenreChip";

export function GenreChipList() {
  return `
    <div class="space-y-3">
      ${GenreColorChip({
        label: "Indie và alternative",
        color: "#e5e7eb", // trắng xám
      })}

      ${GenreColorChip({
        label: "Nhạc hip-hop Brazil",
        color: "#ff9d00",
      })}

      ${GenreColorChip({
        label: "Nhạc hip-hop Ả Rập",
        color: "#qeh123",
      })}

      ${GenreColorChip({
        label: "Nhạc Ả Rập",
        color: "#ff000",
      })}
    </div>
  `;
}
