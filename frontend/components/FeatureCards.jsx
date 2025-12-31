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
    <section className="relative bg-gray-50 pt-20 sm:pt-24 pb-24 sm:pb-32">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-gray-50" />

      <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="
                group bg-white
                px-6 py-6 sm:px-8
                rounded-2xl
                shadow-sm
                transition-all duration-300 ease-out
                hover:shadow-lg hover:-translate-y-1
                text-center md:text-left
              "
            >
              <div
                className="
                  w-12 h-12 mb-6 rounded-xl
                  bg-indigo-100
                  transition-colors duration-300
                  group-hover:bg-indigo-200
                  flex items-center justify-center
                  mx-auto md:mx-0
                "
              >
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>

              <h3 className="text-lg font-semibold mb-2 text-gray-900">
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
