import Link from 'next/link';
import Image from 'next/image';
import { artData } from '@/data/personalData';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-paper pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 flex items-end justify-between flex-wrap gap-6">
          <div>
            <span className="eyebrow">Gallery</span>
            <h1 className="font-display text-4xl md:text-5xl text-ink mt-3">Pencil &amp; pastel</h1>
          </div>
          <Link
            href="/#hobbies"
            className="inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-sm text-ink transition hover:border-accent hover:text-accent"
          >
            ← Back
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artData.map((piece) => (
            <div key={piece.id} className="card overflow-hidden group">
              <div className="relative w-full h-72">
                <Image
                  src={piece.imageUrl}
                  alt={piece.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5 border-t border-line">
                <p className="font-mono text-xs text-accent mb-1">{String(piece.id).padStart(2, '0')}</p>
                <h2 className="font-display text-xl text-ink">{piece.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
