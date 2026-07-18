// Turn a title into a URL-friendly slug: "Who can give blood?" -> "who-can-give-blood".
export function slugify(str) {
  return (str ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
