import { ImageUploader } from '@/components/image-uploader';
import { Bug } from 'lucide-react';
import { Space_Grotesk, Montserrat } from 'next/font/google';

// Load Space Grotesk font for the main title
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['700'],
});

// Load Montserrat for other text
const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-lg shadow-lg">
              <Bug className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className={`${spaceGrotesk.className} text-6xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70`}>
            Insect Identifier
          </h1>
          <p className={`${montserrat.className} text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light`}>
            Upload any insect photo and let our AI instantly identify and provide detailed information about the species.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
          <ImageUploader />
        </div>

        <footer className={`${montserrat.className} mt-12 text-center text-white/60 text-sm font-light`}>
          Powered by Gemini AI • Built with Next.js
        </footer>
      </div>
    </div>
  );
}