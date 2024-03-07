// Mutably updates `mergeInto` with the contents of `mergeFrom`, merging objects deeply.
export function mergeDicts(
  mergeInto: Record<string, unknown>,
  mergeFrom: Record<string, unknown>
) {
  for (const [k, mergeFromV] of Object.entries(mergeFrom)) {
    const mergeIntoV = mergeInto[k];
    if (
      mergeIntoV instanceof Object &&
      !Array.isArray(mergeIntoV) &&
      mergeFrom instanceof Object &&
      !Array.isArray(mergeFromV)
    ) {
      mergeDicts(
        mergeIntoV as Record<string, unknown>,
        mergeFromV as Record<string, unknown>
      );
    } else {
      mergeInto[k] = mergeFromV;
    }
  }
  return mergeInto;
}

export function capitalize(s: string, sep?: string) {
  const items = sep ? s.split(sep) : [s];
  return items
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(sep || "");
}

export function constructJsonArray(items: string[]) {
  return `[${items.join(",")}]`;
}

export const batchRecords = function* (
  allItems: unknown[],
  batchSize: number,
  maxRequestSize: number
) {
  while (true) {
    const items: string[] = [];
    let itemsLen = 0;
    while (items.length < batchSize && itemsLen < maxRequestSize / 2) {
      let item = null;
      if (allItems.length > 0) {
        item = allItems.pop();
      } else {
        break;
      }

      const itemS = JSON.stringify(item);
      items.push(itemS);
      itemsLen += itemS.length;
    }

    if (items.length === 0) {
      break;
    }

    yield items;
  }
};
