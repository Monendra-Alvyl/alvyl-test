/*
 * Draws the murmuration off the page's main thread (see createMurmuration in ./murmuration): the
 * page transfers its canvas here as an OffscreenCanvas, then sends sizes, pointer and scroll.
 * Creating the WebGL context and drawing every frame then never delay taps, scrolling or paint.
 */
import { createFlockRenderer, type FlockCommand, type FlockConfig } from './murmuration'

type Message = FlockCommand | { type: 'init'; canvas: OffscreenCanvas; config: FlockConfig }

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<Message>) => void) | null
  postMessage(message: 'ready' | 'error'): void
}

let draw: ((command: FlockCommand) => void) | null = null

scope.onmessage = ({ data }) => {
  if (data.type === 'init') {
    try {
      draw = createFlockRenderer(data.canvas, data.config, () => scope.postMessage('ready'))
    } catch {
      draw = null
    }
    if (!draw) scope.postMessage('error')
    return
  }
  draw?.(data)
}
