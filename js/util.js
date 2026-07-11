// Small shared helpers.

// Build a real mailto: URL. On a static site with no backend this is our
// verified business endpoint — it opens the user's mail client addressed to
// a real Triangle Coatings inbox. We never claim a message was sent server-side.
export function buildMailto(to, subject, bodyLines) {
  const body = bodyLines.filter(Boolean).join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function announce(el, message) {
  if (el) el.textContent = message;
}
