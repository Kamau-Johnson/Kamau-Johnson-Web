"use client";

import React, { useState } from 'react';
import { Trophy, X, Award, Medal, FileText } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Credential {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  date: string;
  category: 'tech' | 'nontech';
  image: string;
  description: string;
}

const credentials: Credential[] = [
  { 
    id: '1', 
    title: 'Diploma in Computer Science', 
    issuer: 'Zetech University', 
    issuerLogo: '/Zetech Logo.webp', 
    date: 'November 2025', 
    category: 'tech', 
    image: '/Diploma in Computer Science.webp', 
    description: 'Gained a comprehensive foundation in software engineering, data structures, and algorithmic problem-solving.' 
  },
  { 
    id: '2', 
    title: 'Applied Data Science Lab', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'January 2026', 
    category: 'tech', 
    image: '/Applied Data Science.webp', 
    description: 'Specialized in the Applied Data Science program at WorldQuant University, developing hands-on expertise in using statistical models and machine learning to extract insights from real-world datasets.' 
  },
  { 
    id: '3', 
    title: 'Deep Learning Fundamentals Lab', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: 'June 2026', 
    category: 'tech', 
    image: '/Deep Learning Fundamentals Lab.webp', 
    description: 'Specialized in the Deep Learning Fundamentals program at WorldQuant University, developing hands-on expertise in using neural networks and machine learning to extract insights from real-world datasets.' 
  },
  { 
    id: '4', 
    title: 'Computer Vision', 
    issuer: 'WorldQuant University', 
    issuerLogo: '/WorldQuant Logo.webp', 
    date: '2026', 
    category: 'tech', 
    image: '/Computer Vision.webp', 
    description: 'Mastered image processing, object detection, and convolutional neural networks (CNNs) to build systems that can interpret and understand visual data.' 
  },
  { 
    id: '5', 
    title: 'Software Development Scholarship', 
    issuer: 'Power Learn Project', 
    issuerLogo: '/PLP Logo.webp', 
    date: 'December 2025', 
    category: 'tech', 
    image: '/Software Development.webp', 
    description: 'Developed full-stack web development skills under a fully sponsored scholarship program, building practical web applications and gaining hands-on experience.' 
  },
  { 
    id: '6', 
    title: 'Diploma in Leadership and Management Styles', 
    issuer: 'Alison University', 
    issuerLogo: '/Alison Logo.webp', 
    date: 'June 2025', 
    category: "nontech",
    image: '/Diploma in Leadership and Management Styles.webp', 
    description: 'Gained comprehensive expertise in organizational leadership, team dynamics, and strategic decision-making focused on mastering various management styles.' 
  },
  { 
    id: '7', 
    title: 'Diploma in Using Python for Data Science', 
    issuer: 'Alison', 
    issuerLogo: '/Alison Logo.webp', 
    date: 'January 2026', 
    category: 'tech', 
    image: '/Diploma in using Python for Data Science.webp', 
    description: 'Undertook a self-taught journey in Data Science, applying Python libraries like Pandas and NumPy for advanced data cleaning and exploratory analysis.' 
  },
  { 
    id: '11', 
    title: 'Introduction to Data Science', 
    issuer: 'Cisco', 
    issuerLogo: '/Cisco Logo.webp', 
    date: '2024', 
    category: 'tech', 
    image: '/Certificate in  Data Science.webp', 
    description: 'Gained a foundational understanding of data science principles, data analysis, and the role of data in decision-making through Cisco Networking Academy.' 
  },
  { 
    id: '12', 
    title: 'Diploma in Cyber Security', 
    issuer: 'Alison', 
    issuerLogo: '/Alison Logo.webp', 
    date: 'February 2025', 
    category: 'tech', 
    image: '/Diploma in Cyber Security.webp', 
    description: 'Mastered the principles of network security, risk management, and cryptography to protect organizational infrastructure from cyber threats.' 
  },
  { 
    id: '13', 
    title: 'Mathematics for Machine Learning', 
    issuer: 'Simplilearn', 
    issuerLogo: '/Simplilearn Logo.webp', 
    date: 'March 2026', 
    category: 'tech', 
    image: '/Mathematics for Machine Learning.webp', 
    description: 'Studied optimization algorithms and vector calculus to build and fine-tune advanced machine learning models.' 
  },
  { 
    id: '14', 
    title: 'Mathematics for Data Science', 
    issuer: 'Simplilearn', 
    issuerLogo: '/Simplilearn Logo.webp', 
    date: 'March 2026', 
    category: 'tech', 
    image: '/Mathematiics for Data Science.webp', 
    description: 'Developed professional-level mathematics skills for data science, mastering linear algebra and multivariable calculus.' 
  },
  { 
    id: '15', 
    title: 'Statistics for Data Science', 
    issuer: 'Simplilearn', 
    issuerLogo: '/Simplilearn Logo.webp', 
    date: 'March 2026', 
    category: 'tech', 
    image: '/Statistics for Data Science.webp', 
    description: 'Developed a strong foundation in statistics using probability distributions and hypothesis testing for data-driven decision-making.' 
  },
  { 
    id: '16', 
    title: 'SQL for Data Science', 
    issuer: 'Simplilearn', 
    issuerLogo: '/Simplilearn Logo.webp', 
    date: 'February 2026', 
    category: 'tech', 
    image: '/SQL for Data Science.webp', 
    description: 'Attained advanced expertise in SQL, executing complex queries and managing data within large-scale relational database systems.' 
  },
  { 
    id: '17', 
    title: 'Business Analytics with Excel', 
    issuer: 'Simplilearn', 
    issuerLogo: '/Simplilearn Logo.webp', 
    date: 'February 2026', 
    category: 'tech', 
    image: '/Business Analytics with Excell.webp', 
    description: 'Utilized advanced Excel functions and pivot tables to perform comprehensive data-driven business reporting.' 
  },
    { 
    id: '18', 
    title: 'Enterprise Networking, Security & Automation', 
    issuer: 'CCNA', 
    issuerLogo: '/CCNA Logo.webp', 
    date: 'January 2024', 
    category: 'tech', 
    image: '/CCNA Certification 3.webp', 
    description: 'Mastered the configuration of wide-area networks and network security automation for large-scale enterprises.' 
  },
  { 
    id: '19', 
    title: 'Switching, Routing & Wireless Essentials', 
    issuer: 'CCNA', 
    issuerLogo: '/CCNA Logo.webp', 
    date: 'May 2024', 
    category: 'tech', 
    image: '/CCNA Certification 2.webp', 
    description: 'Configured routers and switches to manage secure data traffic across wireless and wired network segments.' 
  },
  { 
    id: '20', 
    title: 'Introduction to Networks', 
    issuer: 'CCNA', 
    issuerLogo: '/CCNA Logo.webp', 
    date: 'January 2024', 
    category: 'tech', 
    image: '/CCNA Certification 1.webp', 
    description: 'Learned the architecture and protocols necessary for establishing secure and efficient local area networks.' 
  },
  { 
    id: '21', 
    title: 'Blockchain & Web 3 Bootcamp Hackathon', 
    issuer: 'MUUIA', 
    issuerLogo: 'MUUIA Logo.webp', 
    date: 'May 2025', 
    category: 'tech', 
    image: '/Blockchain Bootcamp.webp', 
    description: 'Led a team in a 4-day hackathon to create BebaPay, a blockchain platform rewarding recycling and enabling fee-free payments.' 
  },
  { 
    id: '22', 
    title: 'Data Science Internship', 
    issuer: 'CODSOFT', 
    issuerLogo: '/CODSOFT Logo.webp', 
    date: 'February 2025', 
    category: 'tech', 
    image: '/CODSOFT Internship.webp', 
    description: 'Engineered predictive models and developed data visualizations to address real-world business challenges.' 
  },
  { 
    id: '23', 
    title: 'Cyber Security Internship', 
    issuer: 'Future Interns', 
    issuerLogo: '/Future Interns Logo.webp', 
    date: 'January 2025', 
    category: 'tech', 
    image: '/Future Interns Internship.webp', 
    description: 'Conducting vulnerability assessments and implementing threat mitigation strategies to gain hands-on security experience.' 
  },
  { 
    id: '24', 
    title: 'Cyber Security Internship', 
    issuer: 'CODE ALPHA', 
    issuerLogo: '/CODE ALPHA Logo.webp', 
    date: 'February 2025', 
    category: 'tech', 
    image: '/CODE ALPHA Internship.webp', 
    description: 'Explored threat landscapes and mitigation strategies to evaluate and gain hands-on experience in the field.' 
  },
  { 
    id: '25', 
    title: 'Certificate in Front End Development', 
    issuer: 'Mindluster', 
    issuerLogo: '/Mindluster Logo.webp', 
    date: 'February 2024', 
    category: 'tech', 
    image: '/Front End Development.webp', 
    description: 'Developed responsive user interfaces using modern technologies including HTML, CSS, JavaScript, and Next.js.' 
  },
  { 
    id: '26', 
    title: 'Python Programming', 
    issuer: 'Alison', 
    issuerLogo: '/Alison Logo.webp', 
    date: 'May 2023', 
    category: 'tech', 
    image: 'Python Programming.webp', 
    description: 'Gained proficiency in core programming logic and object-oriented concepts for data-driven solutions.' 
  },
  { 
    id: '27', 
    title: 'Certificate in Graphics Design', 
    issuer: 'Mindluster', 
    issuerLogo: '/Mindluster Logo.webp', 
    date: 'August 2023', 
    category: 'tech', 
    image: '/Graphics Design.webp', 
    description: 'Mastered visual communication and design principles using tools such as Canva and Adobe Premiere Pro.' 
  },
  { 
    id: '28', 
    title: 'Certificate in Effective Communications Skills', 
    issuer: 'Mindluster', 
    issuerLogo: '/Mindluster Logo.webp', 
    date: 'December 2024', 
    category: 'tech', 
    image: '/Effective Communications Skills.webp', 
    description: 'Enhanced professional interpersonal and written communication skills for explaining complex data insights.' 
  },
  { 
    id: '29', 
    title: 'IMUN Leadership Program', 
    issuer: 'IMUN', 
    issuerLogo: '/IMUN Logo.webp', 
    date: 'August 2025', 
    category: 'nontech', 
    image: '/IMUN Leadership Forum.webp', 
    description: 'Refined public speaking and diplomacy skills through international leadership simulations and global networking.' 
  },
  { 
    id: '30', 
    title: 'Generative AI', 
    issuer: 'Linkedin Learning', 
    issuerLogo: '/Linkedin Logo.webp', 
    date: 'July 2025', 
    category: 'tech', 
    image: '/Generative AI.webp', 
    description: 'Learned to leverage Large Language Models and prompt engineering to improve productivity and workflows.' 
  }
];
export default function CredentialsPage() {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const router = useRouter();

  // Base style without the specific purple hover
  const baseButtonStyle = "border-purple-600 text-purple-600 hover:text-white px-5 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group flex items-center";

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F5F1EB" }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Bar Row */}
        <div className="flex justify-between items-center mb-10">
            {/* Back Button pushes to Home #about */}
            <Button 
                variant="outline" 
                onClick={() => router.push('/#about')} 
                className={`${baseButtonStyle} hover:bg-purple-600`}
            >
                <Award className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                Back
            </Button>

            <div className="flex gap-3">
                <Link href="/badges">
                    <Button 
                      variant="outline" 
                      className={`${baseButtonStyle} hover:bg-red-600 hover:border-red-600`}
                    >
                        <Medal className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                        Badges
                    </Button>
                </Link>
                <Link href="/lors">
                    <Button 
                      variant="outline" 
                      className={`${baseButtonStyle} hover:bg-black hover:border-black`}
                    >
                        <FileText className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                        LORs
                    </Button>
                </Link>
            </div>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
              Credentials
            </h1>
          </div>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
          They say you can’t build without proof, well, these are all the certificates I earned through a self-taught journey from accredited and verified organizations, covering <strong>Computer Science, Machine Learning, Data Science, Software Development, and Leadership.</strong>
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((credential) => (
            <div key={credential.id} className="group flex flex-col gap-3">
              <div className="relative w-full aspect-video bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
                <img src={credential.image} alt={credential.title} className="w-full h-full object-cover" />
              </div>

              <button 
                onClick={() => setSelectedCredential(credential)}
                className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
              >
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Popup Window */}
      {selectedCredential && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCredential(null)} 
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-xl w-full relative overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              onClick={() => setSelectedCredential(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100/80 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <div className="rounded-lg border border-gray-200 mb-5 overflow-hidden bg-gray-50 shadow-inner">
                <img 
                  src={selectedCredential.image} 
                  alt={selectedCredential.title} 
                  className="w-full h-auto max-h-[50vh] object-contain mx-auto" 
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {selectedCredential.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">
                    {selectedCredential.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1">
                    <img 
                      src={selectedCredential.issuerLogo} 
                      alt={selectedCredential.issuer} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-purple-700 font-bold text-[10px] uppercase tracking-widest">Issuing Organization</p>
                    <p className="text-gray-900 font-semibold">{selectedCredential.issuer}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm pt-2">
                  <p className="text-gray-500 italic font-medium">Issued: {selectedCredential.date}</p>
                  <Button 
                    variant="secondary" 
                    onClick={() => setSelectedCredential(null)}
                    className="font-bold border border-gray-200 shadow-sm"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}