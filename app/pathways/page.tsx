"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCareerPathwaysData, getSkillGapData } from "@/lib/data/career-pathways";
import { CurrentRoleCard } from "@/components/features/current-role-card";
import { PathwayCard } from "@/components/features/pathway-card";
import { SkillGapPanel } from "@/components/features/skill-gap-panel";
import type { PathwayJob } from "@/lib/data/types";

export default function PathwaysPage() {
  const data = getCareerPathwaysData("23111410"); // Data Scientist
  const [selectedJob, setSelectedJob] = useState<PathwayJob | null>(null);

  const skillGapData = selectedJob
    ? getSkillGapData(data.id, selectedJob.id)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Career Pathways</h1>
        <p className="mt-2 text-gray-600">
          Explore where you could go next and see what skills you need to get there.
        </p>
      </div>

      <div className="mb-8">
        <CurrentRoleCard data={data} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where You Could Go
              </h2>
              <div className="space-y-3">
                {data.advancementJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    isSelected={selectedJob?.id === job.id}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                Where People Come From
              </h2>
              <div className="space-y-3">
                {data.feederJobs.slice(0, 6).map((job) => (
                  <PathwayCard
                    key={job.id}
                    job={job}
                    onClick={() => setSelectedJob(job)}
                    isSelected={selectedJob?.id === job.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          {skillGapData ? (
            <>
              <SkillGapPanel data={skillGapData} />
              <div className="mt-4">
                <Link href="/explore">
                  <Button variant="outline" className="w-full border-charcoal text-charcoal hover:bg-charcoal hover:text-white">
                    Explore {selectedJob?.name} in Job Market
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
              <p>Click on a role to see skill gaps</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
