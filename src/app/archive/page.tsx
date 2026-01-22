'use client';

import Header from '@/components/Header';
import APICard from '@/components/APICard';
import { API } from '@/types';
import styles from './page.module.css';

// Mock data generator for archive
const generateMockAPIs = (count: number, startIndex: number): API[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = ['Google Maps', 'GitHub', 'Twilio', 'Notion', 'Discord', 'Kakao Maps', 'Mapbox', 'Eleven Labs'][i % 8];
    const logoLetters = ['G', 'GH', 'T', 'N', 'D', 'K', 'M', 'EL'][i % 8];
    
    return {
      id: `archive-${startIndex + i}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: 'API Description placeholder...',
      category: 'Development',
      categories: ['Development', 'Tools'],
      rating: (4 + Math.random()).toFixed(1) as any,
      users: '970M people',
      price: i % 2 === 0 ? 'paid' : 'free',
      grade: 'bachelor',
      status: 'approved',
      logo: `https://placehold.co/70x70?text=${logoLetters}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
};

const archiveData = [
    { date: '2025.12.30', apis: generateMockAPIs(4, 0) },
    { date: '2026.1.1', apis: generateMockAPIs(4, 4) },
    { date: '2026.1.1', apis: generateMockAPIs(4, 8) },
    { date: '2026.1.1', apis: generateMockAPIs(4, 12) },
];

export default function ArchivePage() {
    return (
        <div className={`min-h-screen bg-[#F5F7FA] ${styles.archivePage}`}>
            <Header />
            
            <div className="max-w-[1440px] mx-auto px-8 pt-32 pb-20">
                <h1 className="text-center text-3xl font-bold text-[#0f172a] mb-16">Archive</h1>

                <div className="space-y-16">
                    {archiveData.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-xl font-semibold text-[#0f172a] mb-6">{section.date}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {section.apis.map((api) => (
                                    <APICard key={api.id} api={api} />
                                ))}
                            </div>
                            {/* Blue divider/scroll indicator visual mock */}
                            <div className="flex justify-center mt-8">
                                <div className="w-16 h-1 bg-blue-500 rounded-full opacity-0"></div> 
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
