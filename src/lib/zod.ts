import { z } from 'zod'

/*
 * Zod 4 compiles object parsers with `new Function` for speed. The Content-Security-Policy
 * in vercel.json deliberately has no 'unsafe-eval', so that call is blocked and reported as
 * a CSP violation (Lighthouse "inspector-issues"). The jitless mode parses through the
 * interpreter instead: same results, a few microseconds slower per parse.
 * Every schema imports `z` from here so the setting is applied before any schema exists.
 */
z.config({ jitless: true })

export { z }
