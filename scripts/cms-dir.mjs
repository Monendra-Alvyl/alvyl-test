/*
 * Where the CMS content lives: the content-only repository that Sveltia CMS commits to
 * (github.com/Monendra-Alvyl/alvyl-test-blog: blog/, categories/, team/, images/). Locally it is a
 * clone next to this project (../alvyl-test-blog); CI checks it out and sets CMS_CONTENT_DIR.
 * Returns null when the folder is missing, so the scripts keep the last generated files.
 */
import fs from 'node:fs'
import path from 'node:path'

export const ROOT = path.resolve(import.meta.dirname, '..')

export function contentDir() {
  const dir = path.resolve(ROOT, process.env.CMS_CONTENT_DIR || '../alvyl-test-blog')
  if (fs.existsSync(path.join(dir, 'team')) || fs.existsSync(path.join(dir, 'blog'))) return dir
  console.warn(
    `[cms] no content at ${dir}: clone github.com/Monendra-Alvyl/alvyl-test-blog there, or set ` +
      'CMS_CONTENT_DIR. Keeping the last generated content.',
  )
  return null
}
