export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-100 via-white to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 text-sm rounded-full bg-indigo-50 border border-indigo-400 text-indigo-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          NLP-Powered Resume Intelligence
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-8">
          Automated Resume Evaluation{" "}
          <span className="block text-indigo-500">& Skill Gap Analysis</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
          Upload resumes, analyze ATS compatibility, identify missing skills,
          rank candidates, and generate optimized resumes using advanced NLP and
          machine learning algorithms.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="/analyze"
            className="px-8 py-4 rounded-xl bg-indigo-400 text-white text-base font-semibold hover:bg-indigo-500 transition delay-100 duration-200 ease-in-out shadow-lg shadow-indigo-600/30 hover:-translate-y-1 hover:scale-110 hover:shadow-xl"
          >
            Analyze Resume →
          </a>
          <a
            href="#"
            className="px-8 py-4 rounded-xl border border-black bg-white text-gray-700 text-base font-medium transition delay-100 duration-200 ease-in-out hover:bg-black hover:text-white"
          >
            View Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
