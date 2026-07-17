"use client";

import React, { useState } from 'react';
import { X, Award, FileText, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LOR {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  date: string;
  category: 'tech' | 'nontech';
  image: string;
}

const lors: LOR[] = [
  { id: '1', title: 'Computer Science Diploma Attachment', issuer: 'ACFC', issuerLogo: '/Agro Logo.webp', date: 'March 2025', category: 'tech', image: '/Agro LOR.webp' },
  { id: '2', title: 'Cyber Security Internship', issuer: 'Future Interns', issuerLogo: '/Future Interns Logo.webp', date: 'January 2025', category: 'tech', image: '/Future Intern LOR.webp' },
  { id: '3', title: 'Cyber Security Internship', issuer: 'CODE ALPHA', issuerLogo: '/CODE ALPHA Logo.webp', date: 'March 2025', category: 'tech', image: '/CODEALPHA LOR.webp' },
];

export default function LorsPage() {
  const [selectedLor, setSelectedLor] = useState<LOR | null>(null);
  const router = useRouter();

  const buttonStyle = "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-5 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group flex items-center";

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F5F1EB" }}>
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
            <Button variant="outline" onClick={() => router.back()} className={buttonStyle}><FileText className="w-4 h-4 mr-2" /> Back</Button>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-amber-800" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">Letters of Recommendation</h1>
          </div>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
            Experience and expertise built through collaboration with various accredited organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {lors.map((lor) => (
            <div key={lor.id} className="group flex flex-col">
              <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300">
                <img src={lor.image} alt="Letter" className="w-full h-full object-cover" />
              </div>
              
              <button 
                onClick={() => setSelectedLor(lor)}
                className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200 shadow-sm"
              >
                View Letter
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedLor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedLor(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedLor(null)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
            
            <div className="p-6">
              <div className="rounded border border-gray-200 mb-5 overflow-y-auto max-h-[65vh] shadow-inner bg-gray-50">
                <img src={selectedLor.image} alt={selectedLor.title} className="w-full h-auto" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedLor.title}</h2>
                
                <div className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <img src={selectedLor.issuerLogo} className="w-10 h-10 object-contain bg-white p-1 rounded border" />
                    <span className="font-bold text-gray-900">{selectedLor.issuer}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Issued: {selectedLor.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}