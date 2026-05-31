import type { CatalogEntry, CatalogSection } from "../../catalog";

export function getPlayableCount(sections: CatalogSection[]) {
  return sections.reduce(
    (count, section) => count + section.entries.filter((entry) => entry.status === "playable").length,
    0,
  );
}

export function getTotalCount(sections: CatalogSection[]) {
  return sections.reduce((count, section) => count + section.entries.length, 0);
}

export function normalizeCatalogSearch(value: string) {
  return value.trim().toLowerCase();
}

export function entryMatchesQuery(entry: CatalogEntry, query: string) {
  const normalized = normalizeCatalogSearch(query);

  if (!normalized) return true;

  return (
    entry.title.toLowerCase().includes(normalized) ||
    entry.tag.toLowerCase().includes(normalized) ||
    entry.kind?.toLowerCase().includes(normalized) ||
    entry.id?.toLowerCase().includes(normalized)
  );
}

export function filterCatalog(sections: CatalogSection[], query: string) {
  return sections
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) => entryMatchesQuery(entry, query)),
    }))
    .filter((section) => section.entries.length > 0);
}
