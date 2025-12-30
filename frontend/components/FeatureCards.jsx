import { FileSearch, Brain, Users } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      title: "ATS Compatibility",
      desc: "Check resume formatting for applicant tracking systems",
      icon: FileSearch,
    },
    {
      title: "Skill Gap Analysis",
      desc: "Identify missing skills based on job requirements",
      icon: Brain,
    },
    {
      title: "Candidate Ranking",
      desc: "Compare and rank multiple candidates efficiently",
      icon: Users,
    },
  ];

  return (
    <section className="relative bg-gray-50 pt-24 pb-32">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-gray-50"></div>

      <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="group bg-white px-8 py-5 rounded-2xl shadow-sm transition delay-75 duration-300 ease-in-out hover:shadow-lg"
            >
              {/* icon container */}
              <div className="
                w-12 h-12 mb-6 rounded-xl
                bg-indigo-100
                transition delay-75 duration-300 ease-in-out
                group-hover:bg-indigo-200
                flex items-center justify-center
              ">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {f.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
