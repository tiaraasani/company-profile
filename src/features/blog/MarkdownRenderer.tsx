import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

/*
 * Article body. Headings are demoted one level (authors write "#" for their first heading,
 * but the page already has an h1), external links open safely, images load lazily.
 * Raw HTML is escaped by react-markdown, so user content cannot inject markup.
 */
const components: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  h4: ({ children }) => <h5>{children}</h5>,
  a: ({ href, children }) => {
    const external = typeof href === 'string' && /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  },
  img: ({ src, alt }) => (
    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" decoding="async" />
  ),
}

/** Lazily loaded: react-markdown and remark-gfm only ship with pages that render Markdown. */
export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  )
}
