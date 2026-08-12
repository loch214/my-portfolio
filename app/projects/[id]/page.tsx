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
      <main className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="font-display text-4xl text-ink mb-4">Project not found</h1>
          <p className="body-text mb-8">This one may have been renamed or hasn&rsquo;t been published yet.</p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 border border-accent px-6 py-3 font-mono text-sm text-accent transition hover:bg-accent-soft"
          >
            ← Back to projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper py-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col gap-6">
          <Link
            href="/#projects"
            className="inline-flex w-fit items-center gap-2 border border-line px-5 py-2.5 font-mono text-sm text-ink transition hover:border-accent hover:text-accent"
          >
            ← Back to projects
          </Link>
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">
              {project.title}
            </h1>
            <p className="body-text max-w-3xl whitespace-pre-line">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="border border-line px-3 py-1 font-mono text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 border border-accent px-6 py-3 font-mono text-sm text-accent transition hover:bg-accent-soft"
          >
            View source on GitHub →
          </a>
        </div>

        <div className="space-y-10">
          {project.media.map((item, index) => (
            <div key={`${item.url}-${index}`} className="card overflow-hidden">
              {item.type === 'image' ? (
                <div className="relative w-full overflow-hidden bg-black/20">
                  <Image
                    src={item.url}
                    alt={item.caption}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full overflow-hidden bg-black/20 aspect-video">
                  <iframe
                    src={item.url}
                    title={item.caption}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className="px-6 py-4 text-sm text-muted border-t border-line font-mono">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
