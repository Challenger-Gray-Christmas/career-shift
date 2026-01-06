import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          Navigate Your Career Journey
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore job market trends and discover career transition opportunities with data-driven insights.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-gold hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Career Assessment</CardTitle>
            <CardDescription>
              Get personalized career transition recommendations based on your skills and experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assess">
              <Button className="w-full bg-gold hover:bg-gold/90 text-white">
                Start Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-charcoal hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Explore Job Market</CardTitle>
            <CardDescription>
              Analyze salary trends, top employers, and regional job postings for any occupation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full bg-charcoal hover:bg-charcoal/90">
                Start Exploring
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-charcoal hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-charcoal">Plan Career Transition</CardTitle>
            <CardDescription>
              Discover career pathways, advancement opportunities, and skills gaps for your next role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pathways">
              <Button className="w-full bg-charcoal hover:bg-charcoal/90">
                View Pathways
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
