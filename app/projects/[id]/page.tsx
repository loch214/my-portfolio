import Image from 'next/image';
import Link from 'next/link';
import { projectsData } from '@/data/personalData';
import VideoEmbed from '@/components/VideoEmbed';

interface ProjectCaseStudyProps {
  params: { id: string };
}

/* Every case study is a static array entry, so there is nothing to render per
   request. Without this the route builds as "server-rendered on demand" and
   each visit costs a function invocation and a possible cold start; with it
   all nine become prerendered HTML on the CDN.

   dynamicParams stays at its default (true) on purpose: an id that isn't in
   the data still renders the friendly "Project not found" page below rather
   than a bare 404. */
export function generateStaticParams() {
  return projectsData.map((project) => ({ id: String(project.id) }));
}

export default function ProjectCaseStudyPage({ params }: ProjectCaseStudyProps) {
  const projectId = Number(params.id);
  const project = projectsData.find((item) => item.id === projectId);

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg px-6">
        <div className="max-w-xl text-center">
          <h1 className="t-h2 mb-4 text-ink">Project not found</h1>
          <p className="body-text mb-8">
            This one may have been renamed or hasn&rsquo;t been published yet.
          </p>
          <Link
            href="/#projects"
            className="btn btn-primary"
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
            className="btn btn-outline w-fit"
          >
            ← Back to projects
          </Link>
          <div>
            <h1 className="t-h2 mb-3 italic text-ink">{project.title}</h1>
            <p className="body-text whitespace-pre-line">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="chip"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary w-fit"
          >
            View source on GitHub →
          </a>
        </div>

        <div className="space-y-8">
          {project.media.map((item, index) => (
            <figure key={`${item.url}-${index}`} className="card elev-sm overflow-hidden">
              {item.type === 'image' ? (
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.caption}
                    width={1600}
                    height={900}
                    sizes="(min-width: 896px) 896px, 100vw"
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <VideoEmbed url={item.url} caption={item.caption} />
              )}
              <figcaption className="t-meta max-w-none px-6 py-4">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
