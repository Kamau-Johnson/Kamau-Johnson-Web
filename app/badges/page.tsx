"use client";

import React, { useState } from 'react';
import { X, Award, Medal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Badge {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  date: string;
  category: 'tech' | 'nontech';
  image: string;
  description: string; // Added description field
}

const badges: Badge[] = [
  { 
    id: '1', 
    title: 'Applied Data Science Badge', 
    issuer: 'World Quant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'February 2026', 
    category: 'tech', 
    image: '/Applied Data Science Badge.webp',
    description: 'Earned for achieving 90% and above in the WorldQuant project-based learning program, successfully applying statistical models and machine learning workflows to extract insights from complex real-world datasets.'
  },
    { 
    id: '2', 
    title: 'Deep Learning Fundamentals Lab Badge', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'June 2026', 
    category: 'tech', 
    image: '/Deep Learning Fundamentals Lab Badge 1.png',
    description: 'Awarded for demonstrating proficiency in image processing, object detection, and the implementation of deep learning architectures to solve complex visual recognition challenges.'
  },
      { 
    id: '3', 
    title: 'Deep Learning Fundamentals Lab Badge', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'June 2026', 
    category: 'tech', 
    image: '/Deep Learning Fundamentals Lab Badge 2.webp',
    description: 'Awarded for demonstrating proficiency in image processing, object detection, and the implementation of deep learning architectures to solve complex visual recognition challenges.'
  },
    { 
    id: '4', 
    title: 'Computer Vision Badge', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'April 2026', 
    category: 'tech', 
    image: '/Computer Vision Badge.webp',
    description: 'Awarded for demonstrating proficiency in image processing, object detection, and the implementation of deep learning architectures to solve complex visual recognition challenges.'
  },
  { 
    id: '5', 
    title: 'Introduction to Networks Badge', 
    issuer: 'CCNA', 
    issuerLogo: '/CCNA Logo.webp', 
    date: 'January 2024', 
    category: 'tech', 
    image: '/CCNA Badge 1.webp',
    description: 'Validated foundational knowledge in network architecture, security protocols, and IP connectivity within enterprise environments, earning a Cisco certification.'
  },
  { 
    id: '4', 
    title: 'Switching, Routing, and Wireless Essentials Badge', 
    issuer: 'CCNA', 
    issuerLogo: '/CCNA Logo.webp', 
    date: 'March 2025', 
    category: 'tech', 
    image: '/CCNA Badge 2.webp',
    description: 'Demonstrated expertise in configuring and troubleshooting routers and switches, implementing VLANs, and managing wireless network segments for secure data traffic.'
  }
];

export default function BadgesPage() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const router = useRouter();

  const buttonStyle = "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group flex items-center";

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F5F1EB" }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Bar Row */}
        <div className="flex justify-between items-center mb-10">
            {/* Left side: Back Button */}
            <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className={buttonStyle}
            >
                <Award className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                Back
            </Button>

        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Medal className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">Digital Badges</h1>
          </div>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
            These badges reflect my skills in <strong>Computer Science, Machine Learning, Data Science, Software Development, and Leadership</strong>.
          </p>
        </div>

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {badges.map((badge) => (
            <div key={badge.id} className="group flex flex-col items-center">
              <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition-all p-4 flex items-center justify-center">
                <img src={badge.image} alt="Badge" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <button 
                onClick={() => setSelectedBadge(badge)}
                className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors duration-200 shadow-sm"
              >
                View Badge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Window */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedBadge(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedBadge(null)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100/80 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-all shadow-sm"><X className="w-5 h-5" /></button>
            
            <div className="p-8 text-center">
              <img src={selectedBadge.image} alt={selectedBadge.title} className="w-32 h-32 mx-auto mb-6 object-contain" />
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedBadge.title}</h2>
                {/* One-sentence description */}
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100 mb-6 text-left">
                <img src={selectedBadge.issuerLogo} alt={selectedBadge.issuer} className="w-8 h-8 object-contain bg-white p-1 rounded border border-gray-200" />
                <div>
                  <p className="text-purple-700 font-bold text-[10px] uppercase tracking-widest">Issuer</p>
                  <p className="text-gray-900 font-semibold text-sm">{selectedBadge.issuer}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-500 italic font-medium">Earned: {selectedBadge.date}</p>
                <Button variant="secondary" onClick={() => setSelectedBadge(null)} className="font-bold border border-gray-200">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}