import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Award, MapPin, Mail } from "lucide-react";
import type { QuestionnaireProfile } from "@/lib/data/types";

interface ProfileSummaryCardProps {
  profile: QuestionnaireProfile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-l-4 border-l-gold">
        <CardHeader>
          <CardTitle className="text-2xl text-charcoal">{profile.name}</CardTitle>
          <p className="text-lg text-gold font-medium">{profile.currentRole}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {profile.email}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal">Key Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-gray-100 text-charcoal">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <p className="font-medium text-charcoal">{exp.jobTitle}</p>
                <p className="text-sm text-gold">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.location} | {exp.startYear} - {exp.endYear}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education & Certifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.education.map((edu, index) => (
              <div key={index}>
                <p className="font-medium text-charcoal">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.school}, {edu.endYear}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {profile.certifications.map((cert, index) => (
                <li key={index} className="text-sm text-gray-600">{cert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
