import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Link in Bio App</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Have no account? Create one
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    </main>
  );
}
