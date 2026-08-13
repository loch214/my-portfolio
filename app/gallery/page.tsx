import Link from 'next/link';
import Image from 'next/image';
import { artData } from '@/data/personalData';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-bg px-6 pb-20 pt-32 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="kicker">Gallery</span>
            <h1 className="mt-2 font-heading text-[2rem] text-ink sm:text-4xl">Pencil &amp; pastel</h1>
          </div>
          <Link
            href="/#hobbies"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-neutral-300/60"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artData.map((piece) => (
            <figure key={piece.id} className="card elev-sm overflow-hidden">
              <div className="washed relative h-72 w-full">
                <Image
                  src={piece.imageUrl}
                  alt={piece.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <figcaption className="p-6">
                <span className="kicker">{String(piece.id).padStart(2, '0')}</span>
                <h2 className="mt-1.5 font-heading text-xl text-ink">{piece.title}</h2>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
