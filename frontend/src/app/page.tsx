import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-green-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white space-y-6">
          <h1 className="text-5xl font-bold">Flash Solar Portal</h1>
          <p className="text-xl text-gray-200">Enterprise Management System</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
