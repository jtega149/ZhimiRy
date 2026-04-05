import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">ZhimiRy</h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Snap a photo, get instant disposal guidance powered by Gemini Vision, and track your environmental impact.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Get started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/scan">Open dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
