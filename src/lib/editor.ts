const MAX_SLUG_LENGTH = 200;
const MAX_META_TITLE_LENGTH = 60;
const MAX_META_DESCRIPTION_LENGTH = 160;

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function slugify(value: string) {
  return collapseWhitespace(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, MAX_SLUG_LENGTH);
}

export function getSuggestedSlug(title: string) {
  return slugify(title) || "new-article-draft";
}

export function trimMetaTitle(value: string) {
  return collapseWhitespace(value).slice(0, MAX_META_TITLE_LENGTH);
}

export function trimMetaDescription(value: string) {
  return collapseWhitespace(value).slice(0, MAX_META_DESCRIPTION_LENGTH);
}

export function suggestMetaTitle(title: string) {
  return trimMetaTitle(title);
}

export function suggestMetaDescription(excerpt: string, content: string) {
  const source = excerpt || content;
  return trimMetaDescription(source.replace(/\n+/g, " "));
}
