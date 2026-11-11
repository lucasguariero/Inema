/** ZIP32 sem compressão, limitado aos pequenos arquivos locais deste protótipo. */
export async function pautaZip(files: { name: string; content: Blob }[]) {
  const encoder = new TextEncoder(), parts: BlobPart[] = [], directory: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  if (files.length > 65535) throw new Error('Quantidade de arquivos excede o limite do ZIP demonstrativo.');
  const header = (size: number) => { const bytes = new Uint8Array(size); return { bytes, view: new DataView(bytes.buffer) }; };
  for (const file of files) {
    const name = encoder.encode(file.name), bytes = new Uint8Array(await file.content.arrayBuffer());
    if (bytes.length + offset > 0xffffffff || name.length > 65535) throw new Error('Arquivo excede o limite do ZIP demonstrativo.');
    let crc = 0xffffffff;
    for (const byte of bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = header(30);
    local.view.setUint32(0, 0x04034b50, true); local.view.setUint16(4, 20, true); local.view.setUint16(6, 0x0800, true);
    local.view.setUint16(12, 0x0021, true); local.view.setUint32(14, crc, true);
    local.view.setUint32(18, bytes.length, true); local.view.setUint32(22, bytes.length, true); local.view.setUint16(26, name.length, true);
    parts.push(local.bytes, name, bytes);
    const central = header(46);
    central.view.setUint32(0, 0x02014b50, true); central.view.setUint16(4, 20, true); central.view.setUint16(6, 20, true);
    central.view.setUint16(8, 0x0800, true); central.view.setUint16(14, 0x0021, true); central.view.setUint32(16, crc, true);
    central.view.setUint32(20, bytes.length, true); central.view.setUint32(24, bytes.length, true); central.view.setUint16(28, name.length, true);
    central.view.setUint32(42, offset, true); directory.push(central.bytes, name);
    offset += local.bytes.length + name.length + bytes.length;
  }
  const size = directory.reduce((sum, bytes) => sum + bytes.length, 0), end = header(22);
  end.view.setUint32(0, 0x06054b50, true); end.view.setUint16(8, files.length, true); end.view.setUint16(10, files.length, true);
  end.view.setUint32(12, size, true); end.view.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end.bytes], { type: 'application/zip' });
}
