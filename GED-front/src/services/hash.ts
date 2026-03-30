import { sha256 } from 'js-sha256'

export async function computeFileHash(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const CHUNK_SIZE = 2 * 1024 * 1024  // 2MB chunks
  const hash = sha256.create()
  let offset = 0

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE)
    const buffer = await chunk.arrayBuffer()
    hash.update(buffer)
    offset += CHUNK_SIZE
    onProgress?.(Math.min(100, Math.round((offset / file.size) * 100)))
  }

  return hash.hex()
}
