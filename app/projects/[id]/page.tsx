import Image from 'next/image';
import Link from 'next/link';
import { projectsData } from '@/data/personalData';

interface ProjectCaseStudyProps {
  params: { id: string };
}

export default function ProjectCaseStudyPage({ params }: ProjectCaseStudyProps) {
  const projectId = Number(params.id);
  const project = projectsData.find((item) => item.id === projectId);

  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a1a] to-[#050505] flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-300 mb-8">We couldn&rsquo;t find details for this project. It may have been moved or is not yet published.</p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
          >
            ← Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0f061d] to-[#050505] py-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col gap-4">
          <Link
            href="/#projects"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">{project.title}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-4xl">{project.description}</p>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-purple-100">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
          >
            View Source on GitHub →
          </a>
        </div>

        <div className="space-y-10">
          {project.media.map((item, index) => (
            <div key={`${item.url}-${index}`} className="glass rounded-3xl overflow-hidden">
              {item.type === 'image' ? (
                <div className="relative w-full overflow-hidden bg-black">
                  <Image
                    src={item.url}
                    alt={item.caption}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full overflow-hidden bg-black aspect-video">
                  <iframe
                    src={item.url}
                    title={item.caption}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="px-6 py-4 text-sm text-gray-300 border-t border-white/10">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
