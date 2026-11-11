// Safari/WebKit can reject Blob values in IndexedDB. Store actual bytes, not file metadata.
export async function packBinaries(value: unknown): Promise<unknown> {
 if (value instanceof Blob) return { __fiscalBinary: 1, mime: value.type, bytes: await value.arrayBuffer() };
 if (Array.isArray(value)) return Promise.all(value.map(packBinaries));
 if (value && typeof value === 'object') return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await packBinaries(item)])));
 return value;
}
export function unpackBinaries(value: unknown): unknown {
 if (value instanceof Blob) return value;
 if (Array.isArray(value)) return value.map(unpackBinaries);
 if (value && typeof value === 'object') {
  const item = value as Record<string, unknown>;
  if (item.__fiscalBinary === 1) {
   if (!(item.bytes instanceof ArrayBuffer) || typeof item.mime !== 'string') throw Error('Arquivo local corrompido. Preserve os dados para recuperação.');
   return new Blob([item.bytes], { type: item.mime });
  }
  return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, unpackBinaries(child)]));
 }
 return value;
}
