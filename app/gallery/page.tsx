import Link from 'next/link';
import Image from 'next/image';
import { artData } from '@/data/personalData';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-bg px-6 pb-20 pt-32 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
          <h1 className="t-h2 italic text-ink">Pencil &amp; pastel</h1>
          <Link
            href="/#hobbies"
            className="t-btn inline-flex items-center gap-2 rounded-md border border-line px-6 py-3.5 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artData.map((piece) => (
            <figure key={piece.id} className="card washed-reveal overflow-hidden">
              <div className="relative h-72 w-full">
                <Image
                  src={piece.imageUrl}
                  alt={piece.title}
                  fill
                  className="washed object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <figcaption className="flex items-baseline gap-3 p-6">
                <span className="t-data text-accent">{String(piece.id).padStart(2, '0')}</span>
                <h2 className="t-h4 text-ink">{piece.title}</h2>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
