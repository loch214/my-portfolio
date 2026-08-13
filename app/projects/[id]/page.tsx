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
      <main className="grid min-h-screen place-items-center bg-bg px-6">
        <div className="max-w-xl text-center">
          <h1 className="mb-4 font-heading text-[2rem] text-ink">Project not found</h1>
          <p className="body-text mb-8 text-base">
            This one may have been renamed or hasn&rsquo;t been published yet.
          </p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-bg transition-colors hover:bg-accent-600 active:bg-accent-700"
          >
            ← Back to projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex flex-col gap-6">
          <Link
            href="/#projects"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-neutral-300/60"
          >
            ← Back to projects
          </Link>
          <div>
            <h1 className="mb-3 font-heading text-[2rem] text-ink sm:text-4xl">{project.title}</h1>
            <p className="body-text max-w-3xl whitespace-pre-line text-base">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-200 px-3 py-1 text-[13px] font-semibold text-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-bg transition-colors hover:bg-accent-600 active:bg-accent-700"
          >
            View source on GitHub →
          </a>
        </div>

        <div className="space-y-8">
          {project.media.map((item, index) => (
            <figure key={`${item.url}-${index}`} className="card elev-sm overflow-hidden">
              {item.type === 'image' ? (
                <div className="washed relative w-full overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.caption}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  <iframe
                    src={item.url}
                    title={item.caption}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <figcaption className="px-6 py-4 text-[15px] text-ink-soft">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
