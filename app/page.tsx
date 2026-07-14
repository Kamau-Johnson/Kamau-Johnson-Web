"use client"

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // Add this line
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProjectCarousel from "@/components/ProjectCarousel"
import { Card, CardContent } from "@/components/ui/card"
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Download,
  Code,
  Database,
  Send,
  Menu,
  X,
  ChevronRight,
  Heart,
  ArrowLeft,
  Play,
  MessageCircle,
  Youtube,
  Award,
  CheckCircle
} from "lucide-react"
import emailjs from '@emailjs/browser';

const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return [ref, isIntersecting] as const
}

const AnimatedSection: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className = "", delay = 0 }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isIntersecting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const [activeProjectTab, setActiveProjectTab] = useState("data")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const roles = ["ML Engineer", "Data Scientist","Software Developer"]
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayedRole, setDisplayedRole] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

const mentor = {
  name: "Sir. Antony Kariuki",
  work: "Manager, Investment Reporting - Prudential Financial Inc",
  image: "/Mentor1.webp",
  impact: (
    <>
      He mentored me closely in computer science, guiding me as I developed my technical skills 
      and explored different fields until I found my focus in Data Science, Machine Learning, 
      and Software Development. His mentorship, rooted in professional ethics and technical insight, 
      has been pivotal in shaping my growth. He often reminds me{" "}
      <strong><em>"It's now or never."</em></strong> a phrase that pushes me to act decisively,
      seize opportunities, and give my best in every challenge. His guidance continues to inspire me 
      to take initiative and strive for excellence.
    </>
  ),
};

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      const sections = [ "home", "about", "skills", "projects", "achievements", "blog", "contact" ]
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const isTypingComplete = !isDeleting && displayedRole === currentRole
    const isDeletingComplete = isDeleting && displayedRole === ""

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setDisplayedRole((prev) => prev.slice(0, -1))
        } else {
          setDisplayedRole((prev) => currentRole.slice(0, prev.length + 1))
        }

        if (isTypingComplete) {
          setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeletingComplete) {
          setIsDeleting(false)
          setRoleIndex((prev) => (prev + 1) % roles.length)
        }
      },
      isDeleting ? 80 : 120,
    )

    return () => clearTimeout(timeout)
  }, [displayedRole, isDeleting, roleIndex, roles])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };
    
    try {
      await Promise.all([
        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        ),
        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID!,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        )
      ]);
      
      setSubmitStatus('success');
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('FAILED TO SEND EMAIL...', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const navItems = [
    { id: "about", label: "ABOUT" },
    { id: "skills", label: "SKILLS" },
    { id: "projects", label: "PROJECTS" },
    { id: "achievements", label: "ACHIEVEMENTS" },
    { id: "blog", label: "BLOG" },
    { id: "contact", label: "CONTACT" }
  ];

const skills = [
  { name: "Leadership", category: "data_science", iconPath: "/icons/Leadership.webp" },
  { name: "HTML", category: "development", iconPath: "/icons/HTML.webp" },
  { name: "CSS", category: "development", iconPath: "/icons/CSS.webp" },
  { name: "JavaScript", category: "development", iconPath: "/icons/Javascript.gif" },
  { name: "Next.js", category: "development", iconPath: "/icons/Next.js.webp" },
  { name: "Tailwind CSS", category: "development", iconPath: "/icons/Tailwind CSS.webp" },
  { name: "Python", category: "data_science", iconPath: "/icons/Python.webp" },
  { name: "MySQL", category: "data_science", iconPath: "/icons/MySQL.webp" },
  { name: "Excel", category: "data_science", iconPath: "/icons/Excel.webp" },
  { name: "Power BI", category: "data_science", iconPath: "/icons/Power BI.webp" },
  { name: "Git", category: "data_science", iconPath: "/icons/Git.webp" },
];

  const projects = {
  // --- SOFTWARE DEVELOPMENT PROJECTS ---
  dev: [
    {
      id: "ovault",
      title: "O-VAULT System",
      description: "Securely stores and manages personal IDs and documents.",
      image: "/O-VAULT Thumbnail.webp",
      heroImage: "/O-VAULT Thumbnail.webp",
      tech: ["HTML", "CSS", "Javascript", "PHP", "MySQL"],
      liveUrl: "https://o-vault.netlify.app/",
      githubUrl: "https://github.com/Kamau-Johnson/O-VAULT-SYSTEM---personal-id-document-keeper-system.",
      videoLink: "https://www.youtube.com/@Kamau_Johnson",
      category: "dev",
      color: "blue",
      detailedDescription: "O VAULT is a secure and user-friendly system built to manage and protect personal IDs and sensitive documents. It simulates real-world authentication with session control, enabling users to log in, access stored credentials, and maintain privacy throughout the session.",
    },
    {
      id: "bebapay",
      title: "BebaPay",
      description: "♻️ Recycle to Earn. Empower the Future. Go Green Initiative",
      image: "/BebaPay Thumbnail.webp",
      heroImage: "/BebaPay Thumbnail.webp",
      tech: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Cypherium Blockchain", "Superbase"],
      liveUrl: "https://v0-deploy-to-vercel-plum-seven.vercel.app/",
      githubUrl: "https://github.com/Kamau-Johnson/BebaPay-Refined-Version",
      videoLink: "https://www.youtube.com/@Kamau_Johnson",
      category: "dev",
      color: "blue",
      detailedDescription: "BebaPay is an innovative recycling and rewards platform designed to promote environmental responsibility through a unique incentive-based model. Users are rewarded with eco-points for recycling materials which can be redeemed for goods or services.",
    },
    {
      id: "sostos-blog",
      title: "Sostos Blog",
      description: "A clean, fast, and responsive blog platform for sharing tech insights, tutorials, and personal thoughts.",
      image: "/Sostos Blog Thumbnail.webp",
      heroImage: "/Sostos Blog Thumbnail.webp",
      tech: ["HTML", "CSS", "Next.js", "React", "Tailwind CSS", "Firebase"],
      liveUrl: "https://sostosblog-git-main-johnson-tech-droids-projects.vercel.app/",
      githubUrl: "https://github.com/Kamau-Johnson/Sostos-Blog---PowerHack-Competition.",
      videoLink: "https://www.youtube.com/@Kamau_Johnson",
      category: "dev",
      color: "blue",
      detailedDescription: "Sostos Blog is a modern, responsive blogging platform designed for sharing technical insights. It delivers a distraction-free reading experience with a minimalist interface that emphasizes clarity and performance.",
    },
  ],

  // --- DATA SCIENCE PROJECTS ---
  data: [
    {
      id: "mtn-volatility",
      title: "Titanic Machine Learning from Disaster Analysis",
      description: "Performed data analysis and built predictive models on the Titanic dataset using Python and machine learning to uncover survival patterns.",
      image: "/Titanic Machine Learning.webp",
      heroImage: "/Titanic Machine Learning1.webp",
      tech: ["Python", "Pandas", "Scikit-learn","Matplotlib", "Seaborn"],
      liveUrl: "https://github.com/Kamau-Johnson/Titanic-Machine-Learning-from-Disaster-Analysis",
      githubUrl: "https://github.com/Kamau-Johnson/Titanic-Machine-Learning-from-Disaster-Analysis",
      videoLink: "https://www.youtube.com/watch?v=pFj8WXH1dAE",
      category: "data",
      "detailedDescription": "In this project, I performed exploratory data analysis on the Titanic dataset to uncover patterns affecting passenger survival. I handled missing data, encoded categorical variables, and visualized trends using Matplotlib and Seaborn. Using Scikit-learn, I trained and evaluated machine learning models including Logistic Regression, Decision Trees, and Random Forests to predict survival outcomes, achieving optimized accuracy through feature selection and hyperparameter tuning."
    },
{
  id: "football-performance-analysis",
  title: "Football Performance Data Analysis",
  description: "Data analysis of football match statistics to identify performance trends, player contributions, and game patterns.",
  image: "/Football Analysis.webp",
  heroImage: "/Football Analysis.webp",
  tech: ["Python", "Pandas", "Matplotlib", "NumPy", "SQL", "Seaborn"],
  liveUrl: "https://github.com/Kamau-Johnson/Football-Matches-Data-Analysis-and-Insights",
  githubUrl: "https://github.com/Kamau-Johnson/Football-Matches-Data-Analysis-and-Insights",
  videoLink: "https://www.youtube.com/@Kamau_Johnson",
  category: "data",
  detailedDescription: "Analyzed football match data using Python to uncover team performance trends, player statistics, and key match insights through data visualization and statistical exploration.",
},
{
  id: "mexico-real-estate-analysis",
  title: "Mexico Real Estate Market Analysis - World Quant University",
  description: "Data analysis of Mexico real estate listings to identify pricing trends, regional patterns, and key market insights across cities and property types.",
  image: "/Housing in Mexico.webp",
  heroImage: "/Housing in Mexico.webp",
  tech: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL", "Seaborn"],
  liveUrl: "https://github.com/Kamau-Johnson/Housing-in-Mexico-Project---World-Quant-University-",
  githubUrl: "https://github.com/Kamau-Johnson/Housing-in-Mexico-Project---World-Quant-University-",
  videoLink: "https://www.youtube.com/@Kamau_Johnson",
  category: "data",
  detailedDescription: "Performed exploratory data analysis on Mexico's real estate dataset to uncover property price trends, location-based patterns, and key factors influencing housing costs using Python data science tools.",
},
  ],
};

  const getCurrentProject = () => {
   if (!selectedProject) return null;
   const allProjects = [...projects.dev, ...projects.data];
   return allProjects.find((project) => project.id === selectedProject)
 };

  const handleProjectClick = (projectId: string) => setSelectedProject(projectId);
  const handleBackToProjects = () => {
  setSelectedProject(null);
  setTimeout(() => {
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    }
  }, 10);
};

const ProjectDetailView = () => {
  const currentProject = getCurrentProject();
  if (!currentProject) return null;

  const baseButtonStyle = "inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm transition-[transform,background-color,box-shadow,color] duration-300 ease-out transform-gpu hover:-translate-y-0.5 hover:shadow-md active:scale-95 group select-none";
  
  const purpleButtonStyle = `${baseButtonStyle} border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-transparent`;
  const darkButtonStyle = `${baseButtonStyle} border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent`;
  const backButtonStyle = `${baseButtonStyle} border-2 border-purple-600 text-purple-600 bg-white/90 backdrop-blur-sm hover:bg-purple-600 hover:text-white shadow-sm`;

  return (
    <div className="min-h-screen text-gray-800" style={{ backgroundColor: "#F5F1EB" }}>
      <header className="relative w-full h-[40vh] md:h-[45vh] bg-cover bg-center" style={{ backgroundImage: `url('${currentProject.heroImage}')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
        
        <div className="absolute top-6 left-6 md:left-12 z-30">
          <button 
            onClick={handleBackToProjects}
            className={backButtonStyle}
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" /> 
            Back
          </button>
        </div>

        <div className="absolute bottom-10 left-6 md:left-12 z-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-xl">
            {currentProject.title}
          </h2>
        </div>
      </header>

      <main className="p-6 md:p-12 lg:px-24 relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1">
            <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-purple-600 mb-6 uppercase tracking-tight">Project Overview</h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10">
                {currentProject.detailedDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <button className={purpleButtonStyle}>
                    <ExternalLink className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                    Live Demo
                  </button>
                </a>

                <a href={currentProject.videoLink} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <button className={purpleButtonStyle}>
                    <Play className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                    Video Demo
                  </button>
                </a>
                
                <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <button className={darkButtonStyle}>
                    <Github className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> 
                    Source Code
                  </button>
                </a>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80">
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b-2 border-purple-100 uppercase tracking-widest">
                Tech Stack
              </h4>
              <ul className="space-y-4">
                {currentProject.tech.map((tech, index) => (
                  <li key={index} className="flex items-center text-gray-700 text-sm font-semibold group transition-all duration-200 hover:translate-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-4 group-hover:scale-150 transition-transform"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

  if (selectedProject) { return <ProjectDetailView /> }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-40 border-b border-slate-800">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 lg:px-12 max-w-screen-2xl mx-auto">
          <div className="text-xl font-bold cursor-pointer group relative" onClick={() => scrollToSection("home")}>
            <span className="text-white hover:text-purple-400 transition-colors duration-300">Kamau Johnson</span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => ( <button key={item.id} onClick={() => scrollToSection(item.id)} className={`relative transition-all duration-300 hover:text-purple-400 font-medium text-sm tracking-wide ${ activeSection === item.id ? "text-purple-400" : "text-gray-300" } hover:scale-105 active:scale-95`} > {item.label} {activeSection === item.id && ( <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div> )} </button> ))}
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-purple-400 active:scale-95 transition-transform" > {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} </Button>
          </div>
        </div>
        {mobileMenuOpen && ( <div className="md:hidden bg-slate-800 border-t border-slate-700"> <div className="px-6 py-4 space-y-4"> {navItems.map((item) => ( <button key={item.id} onClick={() => scrollToSection(item.id)} className={`block w-full text-left transition-colors hover:text-purple-400 font-medium ${ activeSection === item.id ? "text-purple-400" : "text-gray-300" }`} > {item.label} </button> ))} </div> </div> )}
      </nav>

      <section id="home" className="min-h-screen pt-20">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
          <AnimatedSection className="h-full min-h-[50vh] lg:min-h-full">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-none blur-xl opacity-30 animate-pulse"></div>
              <Image src="/My Image.webp" alt="Kamau Johnson - Software Developer | Data Scientist" fill className="relative object-cover" priority sizes="(max-width: 1023px) 100vw, 50vw" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200} className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <div className="text-lg text-purple-400 font-medium">Hi, I'm</div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Kamau Johnson</h1>
                <h2 className="text-xl sm:text-2xl text-gray-300 font-semibold h-8 lg:h-10">
                  <span>{displayedRole}</span>
                  <span className="text-purple-400 animate-pulse">|</span>
                </h2>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-600/20 backdrop-blur-sm">
                <p className="text-base text-gray-300 leading-relaxed"> <span className="font-semibold text-white text-lg">ML Engineer | Data Scientist | Software Developer | Tech Content Creator</span> <br /> <span className="flex items-center justify-center lg:justify-start gap-2 mt-3 italic text-purple-300 text-sm"> <Image src="/icons/Quote.webp" alt="Quote Icon" width={16} height={16} className="w-4 h-4" /> The ones who think they can change the world are the ones who do. </span> <br /> <span className="text-purple-500 text-sm">Inspired by Apple, 1997</span> <br /> <span className="mt-2 inline-block text-white text-sm"> Let's create some tech magic, no wands needed. </span> </p>
              </div>
              <div className="flex justify-center gap-4 sm:gap-6 mt-10 flex-wrap">
                {[
{ href: "https://www.linkedin.com/in/kamau-johnson-4bab25276/", imgSrc: "/icons/Linkedin.webp", alt: "LinkedIn", },
{ href: "https://github.com/Kamau-Johnson", imgSrc: "/icons/Github.gif", alt: "GitHub", },
{ href: "https://www.youtube.com/@OfficialKamauJohnson", imgSrc: "/icons/Youtube.webp", alt: "YouTube", },
{ href: "https://medium.com/@Kamau_Johnson", imgSrc: "/icons/Medium.gif", alt: "Medium", },
{ href: "mailto:johnsonkamau542@gmail.com", imgSrc: "/icons/Email.webp", alt: "Email", },
{ href: "https://wa.me/+254779063681", imgSrc: "/icons/Whatsapp.webp", alt: "WhatsApp", },
].map((social, index) => ( <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-14 h-14 sm:w-[62.5px] sm:h-[62.5px] rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 group" > <Image src={social.imgSrc || "/placeholder.svg"} alt={social.alt} width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 group-hover:scale-110" /> </a> ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

 <section id="about" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative" style={{ backgroundColor: "#F5F1EB" }}>
  <div className="max-w-6xl mx-auto">
    <AnimatedSection>
       <div className="text-center md:text-left mb-8 md:mb-12">
         <h2 className="text-3xl md:text-4xl font-bold text-gray-800">About</h2>
       </div>
     </AnimatedSection>
    
     <div className="grid lg:grid-cols-2 gap-12 items-start">
      <AnimatedSection delay={200} className="space-y-6">
        <div className="relative">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Who Am I?</h3>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
               I am a tech-savvy Computer Science professional passionate about creating impactful solutions. As a Data Scientist, aspiring Machine Learning Engineer, and Software Developer, I combine analytical thinking with coding expertise to build data-driven systems that turn complex information into actionable insights.
            </p>
            <h3 className="text-xl font-semibold text-purple-600 mb-4">My Journey</h3>
            <p>
              Beyond academics and personal projects, I'm an avid hackathon enthusiast, having participated in four local hackathons and proudly winning one at the <strong>Nairobi County Web3 and Blockchain Hackathon</strong>. I led the development of a <strong>tokenized waste recycling system</strong>, combining innovation with social impact.
            </p>
            <p>
              I started as a self-taught developer, driven by curiosity and determination. I developed expertise through a combination of online courses, certifications, and hands-on projects focused on data science, leadership, and technology.
            </p>
            <p>
              This journey of continuous learning and practical experience has built a strong foundation in software development, data science, and machine learning, preparing me for a career focused on building intelligent and impactful technological solutions.
            </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
             <Code className="w-6 h-6 text-blue-600 mb-2 transition-transform duration-300 group-hover:scale-110" />
             <h4 className="font-semibold text-blue-600 text-sm">Software Developer</h4>
             <p className="text-xs text-gray-600">Builder of Seamless Systems</p>
           </div>
          <p className="text-gray-700 leading-relaxed text-sm"> I build modern, responsive web applications using HTML, CSS, JavaScript, Tailwind CSS, Next.js, Python, and SQL. </p>
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
             <Database className="w-6 h-6 text-green-600 mb-2 transition-transform duration-300 group-hover:scale-110" />
             <h4 className="font-semibold text-green-600 text-sm">Data Scientist and ML Engineer</h4>
             <p className="text-xs text-gray-600">Machine learning, analytics, predictive modeling</p>
           </div>
          <p className="text-gray-700 leading-relaxed text-sm"> For data science and machine learning, I use Python, SQL, and libraries such as Pandas, NumPy, and Scikit-learn to analyze data, build models, and extract insights. </p>
        </div>
      
             <h3 className="text-xl font-semibold text-purple-600 mb-4">Career</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Bachelor of Science in Computer Science</strong> – Catholic University of Eastern Africa (CUEA)</li>
              <li><strong>Diploma in Computer Science</strong> – Zetech University (ZU)</li>
              <li><strong>Applied Data Science</strong> – WorldQuant University (WQU)</li>
              <li><strong>Deep Learning</strong> – WorldQuant University (WQU)</li>
              <li><strong>Computer Vision</strong> – WorldQuant University (WQU)</li>
              <li><strong>Software Development</strong> – Power Learn Project (PLP)</li>
              <li><strong>Diploma in Leadership and Management Styles</strong> – Alison University (AU)</li>
            </ul>
          </div>
        </div>

         <div className="pt-4 flex flex-col gap-4 items-start">
  <p className="text-gray-700 text-base max-w-2xl">
    These are all my credentials, reflecting a self-driven learning journey and accredited by verified organizations.
  </p>
 <Link href="/certifications">
  <Button
    variant="outline"
    className="border-red-600 text-blue-600 hover:bg-red-600 hover:text-white px-6 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group"
  >
    <Award className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> Certifications
  </Button>
</Link>
  
  <p className="text-gray-700 text-base max-w-2xl">
    Below is my CV and Digital Business Card...Get to know me.
  </p>

<div className="flex items-center gap-4 flex-wrap">
  <a href="/Kamau Johnson's Resume.pdf" download target="_blank" rel="noopener noreferrer">
    <Button
      variant="outline"
      className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group"
    >
      <Download className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
      Download Resume
    </Button>
  </a>

  <a href="/Kamau Johnson's Business Card.pdf" download target="_blank" rel="noopener noreferrer">
    <Button
      variant="outline"
      className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group"
    >
      <Download className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
      Digital Business Card
    </Button>
  </a>
</div>
</div>
      </AnimatedSection>
      <AnimatedSection delay={400} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative group">
             <Image src="/About Coder.gif" alt="Coding animation" width={300} height={200} className="rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105" unoptimized />
             <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent rounded-lg"></div>
           </div>
        </div>
        <h3 className="text-xl font-semibold text-purple-600 flex items-center">Why I Love Tech</h3>
        <p className="text-gray-700 leading-relaxed text-sm"> I believe technology is a powerful catalyst for change, capable of transforming lives and addressing real-world challenges. Whether it's developing web applications that empower businesses or creating data models that uncover valuable insights, I am driven by the opportunity to build meaningful and impactful solutions through code. To me, technology is not just about building—it's about solving, serving, and scaling human potential. </p>
        
        <h3 className="text-xl font-semibold text-purple-600 flex items-center">Mentor</h3>
        <p className="text-gray-700 leading-relaxed text-sm">I am deeply grateful for the mentorship and guidance that continue to support and inspire my growth in the technology field.</p>
        
         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-4 group">
          <div className="relative w-28 h-28 flex-shrink-0">
             <div className="absolute inset-0 bg-purple-600 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="relative w-full h-full rounded-full border-2 border-purple-600 p-1 bg-white overflow-hidden shadow-lg transition-transform duration-500 group-hover:scale-105">
               <Image
                 src={mentor.image}
                 alt={mentor.name}
                 fill
                 className="object-cover rounded-full"
               />
             </div>
          </div>
          <div className="flex flex-col justify-center text-center sm:text-left">
     <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
    <h4 className="font-bold text-gray-800 text-lg">{mentor.name}</h4>
     <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white stroke-[1.5]" />
  </div>
   <p className="text-xs text-purple-600 font-medium mb-1">
    {mentor.work}
  </p>
   <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
    "{mentor.impact}"
  </p>
 </div>
        </div>

         <h3 className="text-xl font-semibold text-purple-600 flex items-center pt-6">Next Goal</h3>
        <p className="text-gray-700 leading-relaxed text-sm">I have completed my self-learning in Data Science and Software Development and am now pursuing internships and remote opportunities. These roles will enable me to gain hands-on experience, apply my skills to real-world projects, and continue growing professionally while completing my Bachelor's in Computer Science.</p>
        <h3 className="text-xl font-semibold text-purple-600 flex items-center pt-6">End Goal</h3>
        <p className="text-gray-700 leading-relaxed text-sm">Building on this foundation, I aim to become a Machine Learning Engineer, creating intelligent systems that solve complex problems and make a real-world impact.</p>
        <Button onClick={() => scrollToSection("contact")} className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm py-2 group" > Let's Connect <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" /> </Button>
      </AnimatedSection>
    </div>
  </div>
</section>

      <section id="skills" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <AnimatedSection className="lg:w-1/3 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Skillset</h2>
              <p className="text-gray-400 text-lg leading-relaxed"> I have a strong foundation in Machine Learning, Data Science, and Software Development, enabling me to build predictive models, analyze data, and develop scalable applications for high-impact solutions. </p>
            </AnimatedSection>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
{ iconPath: "/icons/Front-End-Development.gif", title: "Frontend Development", description: "I build modern, responsive, and intuitive user interfaces using React, Next.js, and Tailwind CSS to create seamless user experiences.", },
{ iconPath: "/icons/Backend-End-Developement.gif", title: "Backend Development", description: "I create robust, scalable backend systems and secure APIs using SQL and modern technologies to handle complex data flows and power high-performance applications.", },
{ iconPath: "/icons/Data Science and AI.gif", title: "Data Science & ML", description: " Leveraging Python and its libraries, SQL, Power BI, Excel, and Tableau, I develop machine learning models and perform data analysis to extract actionable insights and drive data-informed decisions. ", },
{ iconPath: "/icons/Tech Content Creator.gif", title: "Tech Content Creator", description: "On various platforms like LinkedIn, YouTube, and Medium, I share my journey, projects, and insights in Data Science, Machine Learning, and Software Development, while also building scalable, resilient software systems and creating content to inspire and guide young tech enthusiasts.", },
].map((area, index) => ( <AnimatedSection key={area.title} delay={index * 100} className="group text-center md:text-left"> <div className="mb-5 h-12 w-12 flex items-center justify-center mx-auto md:mx-0 transition-transform duration-300 group-hover:scale-110"> <Image src={area.iconPath || "/placeholder.svg"} alt={`${area.title} icon`} width={48} height={48} className="object-contain" unoptimized={true} /> </div> <h3 className="text-2xl font-bold text-white mb-3">{area.title}</h3> <p className="text-gray-400 text-base leading-relaxed">{area.description}</p> </AnimatedSection> ))}
            </div>
          </div>
          <AnimatedSection delay={600} className="mt-20 md:mt-28">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Tech Stack</h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-12"> A curated stack driving both software development for crafting scalable systems and data science for turning raw data into impactful solutions. </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
              {skills.map((skill, index) => ( <AnimatedSection key={skill.name} delay={index * 100} className="p-4 md:p-6 rounded-lg border border-purple-800/50 bg-slate-800/30 transition-all duration-300 ease-in-out cursor-pointer hover:bg-slate-800/80 hover:border-purple-500 hover:scale-105 group" > <div className="flex items-center gap-4"> <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"> <Image src={skill.iconPath || "/placeholder.svg"} alt={`${skill.name} logo`} width={40} height={40} className="object-contain transition-transform duration-300 group-hover:scale-110" /> </div> <h4 className="font-semibold text-gray-300 text-base md:text-lg">{skill.name}</h4> </div> </AnimatedSection> ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===================== PROJECTS SECTION ===================== */}
      <section id="projects" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <AnimatedSection>
            <div className="text-center md:text-left mb-12 md:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Projects</h2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-600">Data Science and Machine Learning</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Over the past two years, I have focused on Data Science and Machine Learning projects that transform raw data into actionable insights. Using Python, SQL, Pandas, and Scikit-learn, I clean, analyze, and model complex datasets to uncover patterns and build predictive solutions across diverse domains.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a curated collection of my work, from intelligent web applications to data-driven platforms, with each project reflecting a commitment to building functional, user-focused, and scalable solutions.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-600">Software Development</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    I build robust and scalable web applications that prioritize user experience and functional efficiency. Using modern technologies such as Next.js and Tailwind CSS, I create responsive interfaces that perform seamlessly across all devices.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    My development approach combines clean front-end design with secure back-end logic. I am committed to writing maintainable code and delivering systems that effectively meet the needs of businesses and their users.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed"><strong>Toggle below to switch between categories.</strong></p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Tab Toggle — only Software Dev and Data Science */}
          <AnimatedSection delay={200}>
            <div className="flex justify-center md:justify-start mb-12">
              <div className="inline-flex items-center bg-gray-200/50 p-1 rounded-xl backdrop-blur-sm border border-gray-300/20">
                {[
                  { id: "data", label: "Data Science"  },
                  { id: "dev",  label: "Software Dev"  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProjectTab(tab.id)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
                      activeProjectTab === tab.id
                        ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50"
                        : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ── TAB: SOFTWARE DEV ── */}
          {activeProjectTab === "dev" && (
            <>
              {/* Software Dev grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.dev.map((project, index) => (
                  <AnimatedSection key={`dev-${project.id}-${index}`} delay={index * 100}>
                    <Card className="bg-white/60 border border-gray-100 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1.5 group overflow-hidden rounded-2xl">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden aspect-video">
                          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-md text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/50 shadow-sm">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.slice(0, 3).map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded-md border border-gray-200/50">{tech}</span>
                            ))}
                          </div>
                          <div className="flex space-x-3">
                            <Button size="sm" className="flex-1 bg-gray-800 hover:bg-black text-white transition-all duration-300 active:scale-95 text-xs rounded-xl" onClick={() => handleProjectClick(project.id)}>
                              <ExternalLink className="w-3 h-3 mr-1" /> View Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 active:scale-95 rounded-xl bg-transparent" onClick={() => window.open(project.githubUrl, "_blank")}>
                              <Github className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>

              {/* Software Dev carousel — directly below the grid */}
              <AnimatedSection delay={400}>
                <div className="mt-16 pt-8 border-t-2 border-gray-500">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600">More Software Development projects</p>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 ml-4">Hover to scroll through more software development projects</p>
                  <ProjectCarousel
                    accentColor="blue"
                    projects={projects.dev}
                    onProjectClick={handleProjectClick}
                  />
                </div>
              </AnimatedSection>
            </>
          )}

          {/* ── TAB: DATA SCIENCE ── */}
          {activeProjectTab === "data" && (
            <>
              {/* Data Science grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.data.map((project, index) => (
                  <AnimatedSection key={`data-${project.id}-${index}`} delay={index * 100}>
                    <Card className="bg-white/60 border border-gray-100 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1.5 group overflow-hidden rounded-2xl">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden aspect-video">
                          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-md text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/50 shadow-sm">
                              {project.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                          <p className="text-gray-600 text-xs leading-relaxed mb-6 line-clamp-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tech.slice(0, 3).map((tech, techIndex) => (
                              <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded-md border border-gray-200/50">{tech}</span>
                            ))}
                          </div>
                          <div className="flex space-x-3">
                            <Button size="sm" className="flex-1 bg-gray-800 hover:bg-black text-white transition-all duration-300 active:scale-95 text-xs rounded-xl" onClick={() => handleProjectClick(project.id)}>
                              <ExternalLink className="w-3 h-3 mr-1" /> View Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 active:scale-95 rounded-xl bg-transparent" onClick={() => window.open(project.githubUrl, "_blank")}>
                              <Github className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>

              {/* Data Science carousel — directly below the grid */}
              <AnimatedSection delay={400}>
                <div className="mt-16 pt-8 border-t-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full" />
                    <p className="text-xs font-bold uppercase tracking-widest text-purple-600">More Data Science projects</p>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 ml-4">Hover to scroll through more data science projects</p>
                  <ProjectCarousel
                   accentColor="purple"
                   projects={projects.data}
                   onProjectClick={handleProjectClick}
                  />
                </div>
              </AnimatedSection>
            </>
          )}

          {/* View All Button */}
          <AnimatedSection delay={600}>
            <div className="text-center mt-16">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-800 hover:text-white px-8 py-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-95 group bg-transparent rounded-2xl"
                onClick={() => window.open("https://github.com/Kamau-Johnson", "_blank")}
              >
                <Github className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                View All Projects
              </Button>
            </div>
          </AnimatedSection>

        </div>
      </section>

<section id="achievements" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black">
  <div className="max-w-6xl mx-auto">
    
    {/* Header Section */}
    <AnimatedSection>
      <div className="text-center md:text-left mb-12 md:mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Achievements</h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto md:mx-0 leading-relaxed font-normal">
          I am an avid hackathon enthusiast and have proudly represented my work in various competitions. 
          These events have not only sharpened my skills under pressure but have also allowed me to 
          collaborate with brilliant minds and build impactful solutions.
        </p>
      </div>
    </AnimatedSection>

    <AnimatedSection delay={100}>
      <h3 className="text-xl font-semibold text-blue-600 mb-4 uppercase tracking-wide">Highlights</h3>
      
      <div className="relative group mb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 shadow-2x5">
          <Image 
             src="/BebaPay Hackathon.webp" 
             alt="Nairobi County Hackathon" 
             width={1200} 
             height={600} 
             className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
           />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70"></div>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
            <h4 className="text-lg md:text-xl font-bold text-white mb-1">Nairobi County Hackathon</h4>
            <p className="text-sm md:text-base text-white font-medium">Winners • $1000 Cash Prize</p>
          </div>
        </div>
      </div>
    </AnimatedSection>

    <div className="space-y-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AnimatedSection delay={200} className="flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-blue-600 mb-8 uppercase tracking-wide">Track Record</h3>
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-300 group h-full">
            <h4 className="text-xl font-bold text-blue-600 mb-2">Power Hacks Hackathon - 4th Runners-Up</h4>
            <p className="text-gray-400 text-sm mb-4 font-medium uppercase tracking-tight">October 2024 • First Hackathon Experience</p>

            <p className="text-gray-300 leading-relaxed text-sm font-normal">
              <strong className="text-white">SOSTOS Blog</strong> is a platform to verify public statements and combat misinformation. I participated in my first hackathon representing SOSTOS Blog, sponsored by <strong className="text-white">Safaricom</strong> and <strong className="text-white">SpaceYaTech</strong>. As second project lead, I helped develop the platform, coordinate the team, and pitch our solution.
            </p>

            <p className="text-gray-300 leading-relaxed text-sm font-normal">
              Our project earned <strong className="text-white">4th Runners-Up</strong>, giving me hands-on experience in full-stack development, rapid prototyping, teamwork, and presenting innovative solutions.
            </p>

            <div className="bg-black/40 p-4 rounded-xl border border-slate-800 mt-2">
              <h5 className="font-semibold text-blue-600 mb-2 text-xs uppercase tracking-widest">Key Outcomes:</h5>
              <ul className="text-xs text-gray-400 space-y-1 font-medium">
                <li>• Built a platform to verify public statements</li>
                <li>• Coordinated team and supported pitching</li>
                <li>• Secured 4th Runners-Up in a major hackathon</li>
                <li>• Gained practical experience in full-stack development and teamwork</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={300} className="flex flex-col">
          <h3 className="text-xl font-semibold text-blue-600 mb-8 uppercase tracking-wide">MOMENTS FROM MY JOURNEY</h3>
          <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 h-full min-h-[300px]">
            <Image 
               src="/Power Hacks Hackathon.webp" 
               alt="Power Hacks Moment" 
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105" 
             />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
        </AnimatedSection>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AnimatedSection delay={400} className="flex flex-col justify-center">
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-300 group h-full">
            <h4 className="text-xl font-bold text-blue-600 mb-2">Blockchain & Web3 Bootcamp</h4>
            <p className="text-gray-400 text-sm mb-4 font-medium uppercase tracking-tight">April 2025 • Blockchain Hackathon win</p>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm font-normal">
              I participated in an intense <strong className="text-white">4-day Blockchain & Web3 Bootcamp</strong>, where we were introduced to cutting-edge technology and trained on leveraging blockchain to design innovative solutions for real-world problems. 
              On the second day, I led a team of 4 to brainstorm and pitch a project aimed at helping the <strong className="text-white">Nairobi County Government</strong> implement a startup-level environmental solution called the <strong className="text-white">Go Green Initiative</strong>.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm font-normal">
              Our pitch was selected among the <strong className="text-white">top 5 team ideas</strong>, and we were given two weeks to develop a fully functional system. I coordinated the team's tasks, designed the smart contract layer, and ensured the platform architecture was robust and scalable.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm font-normal">
              On the day of the hackathon presentation, our project <strong className="text-white">BebaPay</strong> won <strong className="text-white">$1,000 in cash</strong>, earned collaborations, and opened a broad path for my career in technology. BebaPay is a <strong className="text-white">tokenized recycling platform</strong> that incentivizes residents to recycle by rewarding them with digital tokens, which can be redeemed for goods or services. It aims to reduce waste and promote sustainability through decentralized, transparent transactions.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm font-normal">
              After the bootcamp, we refined BebaPay and presented it to the <strong className="text-white">Nairobi County Government</strong>, showcasing it as a startup-ready solution for their environmental initiatives. The Go Green Initiative integrates technology, community engagement, and blockchain-based incentives to create measurable environmental impact while fostering entrepreneurship and innovation.
            </p>

            <div className="bg-black/40 p-4 rounded-xl border border-slate-800 mt-2">
              <h5 className="font-semibold text-blue-600 mb-2 text-xs uppercase tracking-widest">Key Outcomes:</h5>
              <ul className="text-xs text-gray-400 space-y-1 font-medium">
                <li>• Led a team of 4 to design and build a full-functioning blockchain platform</li>
                <li>• Winner of $1,000 cash prize at the hackathon</li>
                <li>• Developed the Go Green Initiative for Nairobi County Government</li>
                <li>• Created a tokenized recycling platform to incentivize sustainable behavior</li>
                <li>• Gained collaborations, mentorship, and exposure to advanced blockchain technologies</li>
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={500} className="flex flex-col">
          <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 h-full min-h-[300px]">
            <Image 
               src="/BebaPay Hackathon.webp" 
               alt="Blockchain Bootcamp Detail" 
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105" 
             />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
          <br />
          <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 h-full min-h-[300px]">
            <Image 
               src="/Blockchain Bootcamp 1.webp" 
               alt="Blockchain Bootcamp Detail" 
               fill
               className="object-cover transition-transform duration-700 group-hover:scale-105" 
             />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
        </AnimatedSection>
      </div>

      {/* ===================== ZETECH UNIVERSITY (IMAGE LEFT, TEXT RIGHT) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 h-full min-h-[550px]">
          <Image 
            src="/Diploma Graduation pic.webp" 
            alt="Diploma in Computer Science Graduation" 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        </div>

        <AnimatedSection delay={700} className="flex flex-col justify-center lg:order-last">
          <h3 className="text-xl font-semibold text-blue-600 mb-8 uppercase tracking-wide">Diploma in Computer Science</h3>

          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-300 group h-full">
            <h4 className="text-xl font-bold text-blue-600 mb-2">Zetech University</h4>
            <p className="text-gray-400 text-sm mb-4 font-medium uppercase tracking-tight">Academic Journey</p>

            <p className="text-gray-300 leading-relaxed text-sm font-normal mb-6">
              My journey into technology truly began during my <strong className="text-white">Diploma in Computer Science at Zetech University</strong>. 
              Zetech gave me the opportunity to start afresh and rebuild my path from the ground up. It was not an easy road, but through patience,
              discipline, and determination I slowly began shaping the foundation of my career in tech.
              <br /><br />
              It was here that I discovered my passion for data science, machine learning and software development. The journey was long and sometimes
              challenging, but every step helped me grow stronger both academically and personally. Looking back today, the struggle was worth it,
              and by God's grace the journey became a story of growth, resilience, and purpose.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 text-sm flex-1">
                "It always seems impossible until it's done."
                <span className="block text-blue-500 mt-2 not-italic font-medium">
                  by Nelson Mandela
                </span>
              </blockquote>

              <div className="relative w-28 h-28 overflow-hidden rounded-lg border border-slate-700 flex-shrink-0">
                <Image
                  src="/Graduationpic2.webp"
                  alt="Diploma Graduation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ===================== WORLDQUANT UNIVERSITY (TEXT LEFT, SPLIT IMAGES RIGHT) ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AnimatedSection delay={800} className="flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-blue-600 mb-8 uppercase tracking-wide">Advanced Studies in Data Science</h3>

          <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm hover:border-blue-600/30 transition-all duration-300 group h-full flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-blue-600 mb-2">WorldQuant University</h4>
              <p className="text-gray-400 text-sm mb-4 font-medium uppercase tracking-tight">Academic Journey</p>

              <p className="text-gray-300 leading-relaxed text-sm font-normal mb-6">
                My passion for continuous learning and advancing my expertise in artificial intelligence led me to <strong className="text-white">WorldQuant University</strong>, where I pursued <strong className="text-white">Advanced Studies in Data Science</strong> through a rigorous, project based curriculum. The experience strengthened my analytical mindset, sharpened my problem solving abilities, and equipped me with practical skills to develop intelligent, data driven solutions for real world challenges while continuously adapting to emerging technologies.
              </p>

              {/* Subsections Cards */}
              <div className="space-y-4 mb-6">
                <div className="bg-black/30 p-4 rounded-xl border border-slate-800/80 hover:border-blue-600/40 transition-all duration-300">
                  <h5 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1.5">Applied Data Science</h5>
                  <p className="text-gray-300 text-xs leading-relaxed font-normal">
                    <strong className="text-white">Applied Data Science</strong> laid the foundation for my ability to solve complex problems through data driven thinking. Working with real world datasets, I strengthened my skills in data analysis, statistical modeling, predictive analytics, and data visualization, enabling me to transform raw data into meaningful insights that support informed decision making.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-slate-800/80 hover:border-blue-600/40 transition-all duration-300">
                  <h5 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1.5">Deep Learning</h5>
                  <p className="text-gray-300 text-xs leading-relaxed font-normal">
                    Building on this foundation, <strong className="text-white">Deep Learning</strong> expanded my understanding of modern artificial intelligence and intelligent systems. Through practical implementation, I developed the ability to design models that learn from data, recognize patterns, and solve complex challenges, further strengthening my technical expertise in AI and machine learning.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-xl border border-slate-800/80 hover:border-blue-600/40 transition-all duration-300">
                  <h5 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1.5">Computer Vision</h5>
                  <p className="text-gray-300 text-xs leading-relaxed font-normal">
                    My journey culminated in <strong className="text-white">Computer Vision</strong>, where I explored how intelligent systems interpret and understand visual information. This experience broadened my perspective on the practical applications of artificial intelligence while strengthening my ability to develop innovative solutions using image processing and visual intelligence techniques.
                  </p>
                </div>
              </div>
            </div>

            {/* YouTube Video Button Link */}
<div className="mb-6 pt-4 border-t border-slate-800">
  <a 
    href="https://www.youtube.com/watch?v=cc8T8MimqQ8&t=110s" 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-0.5 active:scale-95 group select-none cursor-pointer"
  >
    <Youtube className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
    <span>Watch WQU Graduation on YouTube</span>
    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
  </a>
</div>

            <div className="flex items-center gap-4 mt-4">
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 text-sm flex-1">
                "Continuous learning is the minimum requirement for success in any field."
                <span className="block text-blue-500 mt-2 not-italic font-medium">
                  by Brian Tracy
                </span>
              </blockquote>

              <div className="relative w-28 h-28 overflow-hidden rounded-lg border border-slate-700 flex-shrink-0">
                <Image
                  src="/Kamau Johnson World Quant Uni Logo.webp"
                  alt="WorldQuant University Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="flex flex-col gap-4 h-full">
          <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 flex-1 min-h-[260px]">
            <Image 
              src="/Kamau Johnson World Quant Uni.webp" 
              alt="WorldQuant University Graduation - Pic 1" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="relative overflow-hidden rounded-2x5 border border-slate-800 group-hover:border-blue-600/50 transition-all duration-500 flex-1 min-h-[260px]">
            <Image 
              src="/Kamau Johnson World Quant Uni with Badges.webp" 
              alt="WorldQuant University Graduation - Pic 2" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      <section className="bg-[#f7e5fc] grid grid-cols-1 lg:grid-cols-2 gap-10" id="blog">
        <AnimatedSection className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-black">Medium</h1>
          <p className="text-[#5b6876] mt-6 text-lg leading-relaxed"> I am a technical writer, developer, and curious learner documenting my journey in data science, machine learning and software development. I share what I learn through writing that turns complex ideas into clear, relatable insights. My blog is a space where I explore new concepts, build real-world projects, and reflect on the process behind them the decisions, tools, challenges, and breakthroughs. By sharing both my growth and my work, I aim to educate, inspire, and support others who are learning and building in tech. </p>
          <a href="https://medium.com/@Kamau_Johnson" className="mx-auto lg:mx-0"> <button className="hover:bg-[#4c24dd] text-black py-2 mt-10 border-b-2 border-[#000] hover:px-6 transition duration-300 ease-in-out hover:text-white font-semibold"> Follow me on medium </button> </a>
        </AnimatedSection>
        <AnimatedSection delay={300} className="flex items-center justify-center p-6 pb-12 lg:pb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-800/80 p-8 rounded-lg border border-purple-600/20 shadow-2xl backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center space-x-3"> <div className="w-3 h-3 bg-red-500 rounded-full"></div> <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> <div className="w-3 h-3 bg-green-500 rounded-full"></div> <div className="flex-1 bg-slate-700 h-6 rounded ml-4"></div> </div>
                <div className="space-y-4"> <div className="h-8 bg-purple-600/30 rounded animate-pulse"></div> <div className="space-y-2"> <div className="h-3 bg-slate-600 rounded animate-pulse"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-4/5"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-3/4"></div> </div> <div className="h-20 bg-slate-700 rounded animate-pulse"></div> <div className="space-y-2"> <div className="h-3 bg-slate-600 rounded animate-pulse"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-5/6"></div> </div> </div>
                <div className="flex items-center space-x-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-400 animate-bounce" > <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path> <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path> <path d="m2.3 2.3 7.286 7.286"></path> <circle cx="11" cy="11" r="2"></circle> </svg> <div className="text-purple-400 text-sm">Writing amazing content...</div> </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

<section id="contact" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
  <div className="max-w-4xl mx-auto">
    <AnimatedSection>
      <div className="text-center md:text-left mb-12 md:mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
          Let's Talk Tech
        </h2>
        <p className="text-lg text-gray-300">Tech in motion. Story in progress.</p>
      </div>
    </AnimatedSection>

    <div className="grid lg:grid-cols-2 gap-12">
      <AnimatedSection delay={200} className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-purple-600 mb-6">Let's Connect</h3>
          <p className="text-gray-300 leading-relaxed mb-6 text-sm">
            Big idea brewing? Let's bring it to life. Whether it's a high impact page or a data driven system bold enough for Elon Musk level dreams, I'm all in. Reach out!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Email</p>
              <a href="mailto:johnsonkamau542@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                johnsonkamau542@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300">
              <Phone className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Phone</p>
              <a href="tel:+254768280952" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                +254 768280952
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">Location</p>
              <p className="text-gray-300 text-sm">Nairobi, Kenya</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-300 text-base max-w-2xl">
            Access my digital business card to connect.
          </p>
          <div>
            <a href="/Kamau Johnson's Business Card.pdf" download target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 text-white hover:bg-blue-600 px-6 py-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm flex items-center gap-2">
                <Download className="w-4 h-4 transition-transform duration-300" />
                Digital Business Card
              </Button>
            </a>
          </div>
        </div>

        <div className="pt-6">
          <h4 className="font-semibold mb-4 text-sm">Follow Me</h4>
          <div className="flex flex-wrap gap-4">
            {[
              { href: "https://www.instagram.com/kamaujohnson.dev/?hl=en", imgSrc: "/icons/Instagram icon.webp", alt: "Instagram" },
              { href: "https://www.facebook.com/profile.php?id=61580763350171", imgSrc: "/icons/Facebook icon.webp", alt: "Facebook" },
              { href: "https://tiktok.com/@kamaujohnson.dev", imgSrc: "/icons/Tiktok icon.webp", alt: "TikTok" },
              { href: "https://x.com/Kamau_Johnson_", imgSrc: "/icons/X.webp", alt: "Twitter" },
            ].map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 group">
                <Image src={social.imgSrc} alt={social.alt} width={24} height={24} className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={400} className="space-y-8">
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-xl opacity-30 animate-pulse"></div>
            <Image src="/contact-image.webp" alt="Contact Animation" width={400} height={300} className="relative rounded-lg shadow-2xl border-2 border-purple-600/20 transition-transform duration-300 group-hover:scale-105" />
          </div>
        </div>
        
        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6">Send Me a Message</h3>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={5} className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none transition-all text-sm" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 py-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group disabled:bg-slate-500 disabled:cursor-not-allowed" >
                <Send className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
              {submitStatus === 'success' && ( <p className="text-green-400 text-center text-sm mt-4">Thank you for reaching out.</p> )}
              {submitStatus === 'error' && ( <p className="text-red-400 text-center text-sm mt-4">Failed to send message. Please try again or email me directly.</p> )}
            </form>
          </CardContent>
        </Card>

        <div className="pt-4 flex flex-col items-center">
          <h4 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-widest">Connect with me :</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: "https://www.linkedin.com/in/kamau-johnson-4bab25276/", imgSrc: "/icons/Linkedin1.gif", alt: "Linkedin" },
              { href: "https://github.com/Kamau-Johnson", imgSrc: "/icons/Github.gif", alt: "GitHub" },
              { href: "https://www.youtube.com/@OfficialKamauJohnson", imgSrc: "/icons/Youtube.webp", alt: "YouTube" },
              { href: "tel:+254768280952", imgSrc: "/icons/Contact.webp", alt: "Phone" },
            ].map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 group">
                <Image src={social.imgSrc} alt={social.alt} width={24} height={24} className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  </div>
</section>

        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-400 text-sm">
                  © 2026 Kamau <Heart className="inline w-4 h-4 text-red-500" /> Johnson. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>

        {showScrollTop && ( 
          <Button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 z-40 group" size="icon" > 
            <Image src="/Scroll Cursor.gif" alt="Scroll to top" width={32} height={20} className="w-8 h-5 object-contain" unoptimized /> 
          </Button> 
        )}
      </div>
    )
}
