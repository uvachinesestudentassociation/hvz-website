/** True when a URL hash names this disclosure or one of its descendant section ids. */
export function disclosureShouldOpen(
  hash: string,
  ownId: string | undefined,
  descendantIds: readonly string[],
): boolean {
  const id = hash.replace(/^#/, "")
  if (!id) return false
  if (ownId && id === ownId) return true
  return descendantIds.includes(id)
}
