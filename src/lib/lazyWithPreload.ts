import { createElement, lazy, type ComponentType, type ReactElement } from 'react'

export interface PreloadableComponent<P extends object> {
  (props: P): ReactElement
  /** Loads the chunk; afterwards the component renders synchronously (no Suspense fallback). */
  preload: () => Promise<void>
}

/**
 * React.lazy that can be warmed up ahead of rendering. Used for pages that are not
 * prerendered: main.tsx preloads the current page's chunk first, so header, page and
 * footer appear in one pass instead of skeleton-then-content (which would count as
 * layout shift).
 */
export function lazyWithPreload<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
): PreloadableComponent<P> {
  let loaded: ComponentType<P> | null = null
  const Lazy = lazy(async () => {
    const module = await loader()
    loaded = module.default
    return module
  })

  const Component = ((props: P) =>
    loaded ? createElement(loaded, props) : createElement(Lazy, props)) as PreloadableComponent<P>

  Component.preload = async () => {
    const module = await loader()
    loaded = module.default
  }

  return Component
}
