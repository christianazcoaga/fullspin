// Tiny module-level coordinator so home page sections (Hero, etc.) can
// hold their entrance animations until the splash preloader has faded.
//
// On every fresh mount of <Preloader/>, setPreloaderActive(true) is called
// so subscribers register themselves as listeners. When the preloader
// finishes its fade-out, setPreloaderActive(false) flushes the listeners
// and clears the queue. Subsequent calls to onPreloaderDone() then run
// the callback on a microtask immediately.

let active = true
const listeners = new Set<() => void>()

export function setPreloaderActive(value: boolean): void {
  if (active === value) return
  active = value
  if (!value) {
    // Snapshot to avoid mutation-during-iteration if a listener calls
    // onPreloaderDone again synchronously.
    const snapshot = Array.from(listeners)
    listeners.clear()
    snapshot.forEach((cb) => cb())
  }
}

/**
 * Run `cb` once the preloader has finished. If the preloader is already
 * gone, the callback fires asynchronously (microtask) so the caller's
 * useEffect has finished setting up its cleanup return.
 *
 * Returns an unsubscribe function safe to call from a useEffect cleanup.
 */
export function onPreloaderDone(cb: () => void): () => void {
  if (!active) {
    queueMicrotask(cb)
    return () => {}
  }
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
