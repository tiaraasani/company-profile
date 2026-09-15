import { Button } from '@/components/ui/button'

// Milestone 1 placeholder. Replaced by the router shell in Milestone 2.
function App() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-7xl flex-col items-start justify-center gap-6 px-4 md:px-6"
    >
      <p className="text-sm text-muted-foreground">
        company-profile / scaffold ready
      </p>
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        Suitmedia
      </h1>
      <p className="max-w-prose text-lg text-muted-foreground">
        Vite 8, React 19, Tailwind CSS v4, shadcn/ui and react-router are
        installed. The pages are built in the next milestones.
      </p>
      <Button type="button">Get in touch</Button>
    </main>
  )
}

export default App
