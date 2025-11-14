import Link from 'next/link';
import Image from 'next/image';
import { artData } from '@/data/personalData';

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a1a] to-[#050505] pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-400">Collection</p>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Art Gallery</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-sm font-semibold text-gray-200 hover:text-white hover:border-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artData.map((piece) => (
            <div key={piece.id} className="glass rounded-3xl overflow-hidden group">
              <div className="relative w-full h-72">
                <Image
                  src={piece.imageUrl}
                  alt={piece.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-1">#{String(piece.id).padStart(2, '0')}</p>
                <h2 className="text-xl font-semibold text-white">{piece.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
