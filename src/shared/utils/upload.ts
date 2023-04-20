import { join } from 'path'

export function getUploadDir(path): string {
  return join(__dirname, '../../..', path)
}
