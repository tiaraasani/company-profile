/* oxlint-disable jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions --
   WAI-ARIA carousel pattern: slides are role="group" with aria-roledescription="slide",
   the scroll container must be keyboard-focusable (scrollable-region-focusable), and
   hover/focus listeners only pause auto-rotation (WCAG 2.2.2), they are not controls. */
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react'
import { useCallback, useRef, useState, type FocusEvent } from 'react'
import { Button } from '@/components/ui/button'
import type { Testimonial } from '@/data/testimonials'
import { useDocumentVisible } from '@/hooks/useDocumentVisible'
import { useInterval } from '@/hooks/useInterval'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

const AUTO_ROTATE_MS = 7000

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col justify-between gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
      <div className="flex flex-col gap-4">
        <Quote aria-hidden="true" className="size-6 text-primary" />
        <blockquote className="text-lg leading-relaxed md:text-xl">
          <p>&ldquo;{testimonial.quote}&rdquo;</p>
        </blockquote>
      </div>
      <figcaption className="flex flex-col">
        <span className="font-semibold">{testimonial.role}</span>
        <span className="text-sm text-muted-foreground">{testimonial.company}</span>
      </figcaption>
    </figure>
  )
}

interface TestimonialCarouselProps {
  items: Testimonial[]
  label?: string
}

/**
 * CSS scroll-snap carousel (all slides stay in the DOM). Auto-rotation stops on hover,
 * focus, reduced motion, hidden tab, or when the visitor presses Pause.
 */
export function TestimonialCarousel({ items, label = 'Client testimonials' }: TestimonialCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const tabVisible = useDocumentVisible()
  const reducedMotion = usePrefersReducedMotion()
  const count = items.length

  const scrollToIndex = useCallback(
    (next: number) => {
      const track = trackRef.current
      if (!track || count === 0) return
      const target = ((next % count) + count) % count
      const slide = track.children[target] as HTMLElement | undefined
      if (!slide) return
      track.scrollTo({
        left: slide.offsetLeft - track.offsetLeft,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
      setIndex(target)
    },
    [count, reducedMotion],
  )

  const onScroll = () => {
    if (frameRef.current !== null) return
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null
      const track = trackRef.current
      if (!track) return
      let nearest = 0
      let best = Number.POSITIVE_INFINITY
      Array.from(track.children).forEach((child, i) => {
        const distance = Math.abs(
          (child as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft,
        )
        if (distance < best) {
          best = distance
          nearest = i
        }
      })
      setIndex(nearest)
    })
  }

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false)
    }
  }

  const canRotate = count > 1 && !reducedMotion
  const playing = canRotate && !userPaused && !hovered && !focused && tabVisible
  useInterval(() => scrollToIndex(index + 1), playing ? AUTO_ROTATE_MS : null)

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="flex flex-col gap-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div
        ref={trackRef}
        role="group"
        aria-label="Testimonial slides"
        tabIndex={0}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0"
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-full shrink-0 snap-center md:w-[calc(50%-0.5rem)]"
          >
            <TestimonialCard testimonial={item} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Previous testimonial"
            onClick={() => scrollToIndex(index - 1)}
            disabled={count <= 1}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Next testimonial"
            onClick={() => scrollToIndex(index + 1)}
            disabled={count <= 1}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full"
            aria-label="Pause auto-rotation"
            aria-pressed={userPaused}
            onClick={() => setUserPaused((paused) => !paused)}
            disabled={!canRotate}
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-5" />
            ) : (
              <Play aria-hidden="true" className="size-5" />
            )}
          </Button>
        </div>

        <ol className="flex items-center" aria-label="Choose testimonial">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => scrollToIndex(i)}
                className="flex size-11 items-center justify-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block size-2.5 rounded-full transition-colors',
                    i === index ? 'bg-primary' : 'bg-muted-foreground/40',
                  )}
                />
              </button>
            </li>
          ))}
        </ol>

        <output className="sr-only" aria-live="polite">
          Testimonial {index + 1} of {count}
        </output>
      </div>
    </section>
  )
}
