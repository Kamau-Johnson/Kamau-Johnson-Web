"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
    rootMargin: "50px",
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

  const [activeProjectTab, setActiveProjectTab] = useState("all")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const roles = ["Software Developer", "Data Scientist"]
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayedRole, setDisplayedRole] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

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

  const navItems = [ { id: "about", label: "ABOUT" }, { id: "skills", label: "SKILLS" }, { id: "projects", label: "PROJECTS" }, { id: "achievements", label: "ACHIEVEMENTS" }, { id: "blog", label: "BLOG" }, { id: "contact", label: "CONTACT" } ];
  const skills = [ { name: "HTML", category: "development", iconPath: "/icons/HTML.webp" }, { name: "CSS", category: "development", iconPath: "/icons/CSS.webp" }, { name: "JavaScript", category: "development", iconPath: "/icons/Javascript.gif" }, { name: "Next.js", category: "development", iconPath: "/icons/Next.js.webp" }, { name: "Tailwind CSS", category: "development", iconPath: "/icons/Tailwind CSS.webp" }, { name: "Python", category: "data_science", iconPath: "/icons/Python.webp" } ];
  const projects = { dev: [ { id: "ovault", title: "O-VAULT System", description: "Securely stores and manages personal IDs and documents.", image: "/O-VAULT Thumbnail.webp", heroImage: "/O-VAULT Thumbnail.webp", tech: ["HTML", "CSS", "Javascript", "PHP", "MySQL"], liveUrl: "https://o-vault.netlify.app/", githubUrl: "https://github.com/Kamau-Johnson/O-VAULT-SYSTEM---personal-id-document-keeper-system.", videoLink: "https://www.youtube.com/@Kamau_Johnson", category: "dev", color: "blue", detailedDescription: "O VAULT is a secure and user-friendly system built to manage and protect personal IDs and sensitive documents. It simulates real-world authentication with session control, enabling users to log in, access stored credentials, and maintain privacy throughout the session. The platform focuses on simplicity, data privacy, and seamless user access, making it ideal for safe and efficient document handling.", }, { id: "bebapay", title: "BebaPay", description: "♻️ Recycle to Earn. Empower the Future. Go Green Initiative", image: "/BebaPay Thumbnail.webp", heroImage: "/BebaPay Thumbnail.webp", tech: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Cypherium Blockchain", "Superbase"], liveUrl: "https://v0-deploy-to-vercel-plum-seven.vercel.app/", githubUrl: "https://github.com/Kamau-Johnson/BebaPay-Refined-Version", videoLink: "https://www.youtube.com/@Kamau_Johnson", category: "dev", color: "blue", detailedDescription: "BebaPay is an innovative recycling and rewards platform designed to promote environmental responsibility through a unique incentive-based model. Users are rewarded with eco-points for recycling materials such as plastic, glass, and paper, which can be redeemed for goods or services. The system features secure user authentication, real-time activity tracking, and a personalized dashboard that visualizes individual environmental impact. The platform leverages modern web technologies and integrates the Web Crypto API to ensure secure transactions and data integrity. By combining sustainability with tangible rewards, BebaPay bridges the gap between eco-conscious behavior and everyday digital convenience empowering individuals to contribute to a cleaner planet while earning value in return.", }, { id: "sostos blog", title: "Sostos Blog", description: "A clean, fast, and responsive blog platform for sharing tech insights, tutorials, and personal thoughts.", image: "/Sostos Blog Thumbnail.webp", heroImage: "/Sostos Blog Thumbnail.webp", tech: ["HTML", "CSS", "Next.js", "React", "Tailwind CSS", "Firebase"], liveUrl: "https://sostosblog-git-main-johnson-tech-droids-projects.vercel.app/", githubUrl: "https://github.com/Kamau-Johnson/Sostos-Blog---PowerHack-Competition.", videoLink: "https://www.youtube.com/@Kamau_Johnson", category: "dev", color: "blue", detailedDescription: "Sostos Blog is a modern, responsive blogging platform designed for sharing technical insights, tutorials, and personal reflections. It delivers a distraction-free reading experience with a minimalist interface that emphasizes clarity and performance. The platform supports dynamic content, intuitive navigation, and scalable content organization, making it ideal for developers, writers, and thinkers alike. With a focus on speed, accessibility, and clean design, Sostos empowers creators to publish meaningful content that connects and informs.", }, ], };
  const getFilteredProjects = () => { if (activeProjectTab === "all") { return [...projects.dev] } if (activeProjectTab === "dev") { return projects.dev } return [] };
  const getCurrentProject = () => { if (!selectedProject) return null; const allProjects = [...projects.dev]; return allProjects.find((project) => project.id === selectedProject) };
  const handleProjectClick = (projectId: string) => setSelectedProject(projectId);
  const handleBackToProjects = () => setSelectedProject(null);

  const footerSocials = [
    { href: "https://www.linkedin.com/in/kamau-johnson-4bab25276/", icon: Linkedin, label: "LinkedIn Profile", color: "hover:bg-blue-600 hover:border-blue-600" },
    { href: "https://github.com/Kamau-Johnson", icon: Github, label: "GitHub Profile", color: "hover:bg-purple-600 hover:border-purple-600" },
    { href: "https://www.youtube.com/@Kamau_Johnson", icon: Youtube, label: "YouTube Channel", color: "hover:bg-red-600 hover:border-red-600" },
    { href: "https://x.com/Kamau_Johnson_", icon: Twitter, label: "Twitter Profile", color: "hover:bg-sky-500 hover:border-sky-500" },
    { href: "https://medium.com/@Kamau_Johnson", icon: MessageCircle, label: "Medium Profile", color: "hover:bg-green-600 hover:border-green-600" },
    { href: "mailto:johnsonkamau542@gmail.com", icon: Mail, label: "Send Email", color: "hover:bg-yellow-500 hover:border-yellow-500" },
    { href: "tel:+254768280952", icon: Phone, label: "Phone Call", color: "hover:bg-indigo-500 hover:border-indigo-500" },
  ];

  const ProjectDetailView = () => { const currentProject = getCurrentProject(); if (!currentProject) return null; return ( <div className="min-h-screen bg-gray-50 text-gray-800"> <header className="relative w-full h-[40vh] bg-cover bg-center flex items-start justify-start" style={{ backgroundImage: `url('${currentProject.heroImage}')` }} > <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div> <button onClick={handleBackToProjects} className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg text-gray-700 text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-xl hover:text-gray-900 hover:-translate-y-0.5" > <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" /> <span>Back to Projects</span> </button> </header> <main className="flex-1 p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 -mt-16 relative z-20"> <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 h-full"> <div className="flex-1"> <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100"> <span className="inline-block text-xs font-bold text-purple-600 tracking-wider uppercase mb-4 px-3 py-1 bg-purple-100 border border-purple-200 rounded-full"> PROJECT </span> <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"> {currentProject.title} </h2> <p className="text-lg text-gray-600 mb-8 leading-relaxed">{currentProject.detailedDescription}</p> <div className="flex flex-wrap gap-4 mt-auto"> <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden group" > <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div> <ExternalLink className="w-4 h-4" /> LIVE DEMO </a> <a href={currentProject.videoLink} target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden group" > <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div> <Play className="w-4 h-4" /> VIDEO DEMO </a> </div> </div> </div> <aside className="flex-shrink-0 w-full lg:w-80 lg:pt-24"> <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100"> <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"> Technologies Used </h3> <ul className="space-y-4"> {currentProject.tech.map((tech, index) => ( <li key={index} className="relative pl-6 text-gray-600 font-medium transition-all duration-200 hover:text-gray-900 hover:translate-x-1 cursor-default" > <span className="absolute left-0 top-1 w-2 h-2 bg-purple-500 rounded-full transition-all duration-200 hover:bg-purple-600 hover:scale-125"></span> {tech} </li> ))} </ul> </div> </aside> </div> </main> </div> ) };

  if (selectedProject) { return <ProjectDetailView /> }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-40 border-b border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
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
          <AnimatedSection className="h-full">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-none blur-xl opacity-30 animate-pulse"></div>
              <Image src="/My Image.webp" alt="Kamau Johnson - Software Developer | Data Scientist" fill className="relative object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200} className="flex flex-col justify-center p-8 lg:p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-lg text-purple-400 font-medium flex items-center">Hi, I'm</div>
                <h1 className="text-4xl lg:text-6xl font-bold text-white">Kamau Johnson</h1>
                <h2 className="text-xl lg:text-2xl text-gray-300 font-semibold h-8 lg:h-10">
                  <span>{displayedRole}</span>
                  <span className="text-purple-400 animate-pulse">|</span>
                </h2>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-purple-600/20 backdrop-blur-sm">
                <p className="text-base text-gray-300 leading-relaxed"> <span className="font-semibold text-white text-lg">Software Developer | Data Scientist</span> <br /> <span className="flex items-center gap-2 mt-3 italic text-purple-300 text-sm"> <Image src="/icons/Quote.webp" alt="Quote Icon" width={16} height={16} className="w-4 h-4" /> The ones who think they can change the world are the ones who do. </span> <br /> <span className="text-purple-500 text-sm">Inspired by Apple, 1997</span> <br /> <span className="mt-2 inline-block text-white text-sm"> Let's create some tech magic, no wands needed. </span> </p>
              </div>
              <div className="flex justify-center gap-6 mt-10 flex-wrap">
                {[ { href: "https://www.linkedin.com/in/kamau-johnson-4bab25276/", imgSrc: "/icons/Linkedin.webp", alt: "LinkedIn", }, { href: "https://github.com/Kamau-Johnson", imgSrc: "/icons/Github.gif", alt: "GitHub", }, { href: "https://www.youtube.com/@Kamau_Johnson", imgSrc: "/icons/Youtube.webp", alt: "YouTube", }, { href: "https://medium.com/@Kamau_Johnson", imgSrc: "/icons/Medium.gif", alt: "Medium", }, { href: "mailto:johnsonkamau542@gmail.com", imgSrc: "/icons/Email.webp", alt: "Email", }, { href: "https://wa.me/+254768280952", imgSrc: "/icons/Whatsapp.webp", alt: "WhatsApp", }, ].map((social, index) => ( <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="w-[62.5px] h-[62.5px] rounded-full bg-white flex items-center justify-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 group" > <Image src={social.imgSrc || "/placeholder.svg"} alt={social.alt} width={32} height={32} className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" /> </a> ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="about" className="py-20 px-6 lg:px-12 relative" style={{ backgroundColor: "#F5F1EB" }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection> <div className="text-left mb-4"> <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">About</h2> </div> </AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection delay={200} className="space-y-6">
              <div className="relative">
                <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center">Who Am I ?</h3>
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p> Johnson is a tech-savvy and driven Computer Science graduate passionate about building impactful software solutions. Now stepping confidently into the field of Data Science, he leverages his strong problem-solving foundation to extract insights, build intelligent models, and innovate through data-powered technologies. </p>
                  <p> Beyond academics and personal projects, he is an avid hackathon enthusiast, having participated in four local hackathons and was proud to win one at the Nairobi County Web3 and Blockchain Hackathon. There, he led the development of a tokenized waste recycling system, combining innovation and social impact. </p>
                  <p> I started as a self-taught developer, driven by curiosity and determination. After earning a Diploma in Computer Science from Zetech University, I'm now pursuing my Bachelor's at the Catholic University of Eastern Africa, set to graduate in 2027. Through internships at{" "} <a href="https://www.codsoft.in/internships" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors" > Codsoft </a>{" "} and an industrial attachment at{" "} <a href="https://acfc.co.ke/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors" > Agro Chemical & Food Company Limited (ACFC) </a> , I've gained hands-on experience in data science and software development. </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"> <Code className="w-6 h-6 text-blue-600 mb-2 transition-transform duration-300 group-hover:scale-110" /> <h4 className="font-semibold text-blue-600 text-sm">Software Developer</h4> <p className="text-xs text-gray-600">Builder of Seamless Systems</p> </div>
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"> <Database className="w-6 h-6 text-green-600 mb-2 transition-transform duration-300 group-hover:scale-110" /> <h4 className="font-semibold text-green-600 text-sm">Data Scientist</h4> <p className="text-xs text-gray-600">Machine learning, analytics, predictive modeling</p> </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm"> I currently build modern, responsive web applications using HTML, CSS, JavaScript,Tailwind CSS, Next.js and Python. </p>
              <p className="text-gray-700 leading-relaxed text-sm"> For data science, I use Python along with libraries like Pandas, NumPy, and Scikit-learn to analyze data, build models, and extract insights. </p>
              <div className="pt-4">
                <a href="/Kamau Johnson's Resume.pdf" download target="_blank" rel="noopener noreferrer"> <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-2 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm group" > <Download className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> Download Resume </Button> </a>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={400} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="relative group"> <Image src="/About Coder.gif" alt="Coding animation" width={300} height={200} className="rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105" unoptimized /> <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent rounded-lg"></div> </div>
              </div>
              <h3 className="text-xl font-semibold text-purple-600 flex items-center">Why I Love Tech</h3>
              <p className="text-gray-700 leading-relaxed text-sm"> I believe technology is a powerful catalyst for change, capable of transforming lives and addressing real-world challenges. Whether it's developing web applications that empower businesses or creating data models that uncover valuable insights, I am driven by the opportunity to build meaningful and impactful solutions through code. To me, technology is not just about building it's about solving, serving, and scaling human potential. </p>
              <h3 className="text-xl font-semibold text-purple-600 flex items-center">Next Goal</h3>
              <p className="text-gray-700 leading-relaxed text-sm"> I'm currently seeking internship opportunities and collaborative projects where I can apply my skills in software development and data science to drive real-world impact. My next goal is to join a mission-driven tech team where I can grow into a full-stack developer and data scientist while contributing to meaningful, scalable solutions. </p>
              <Button onClick={() => scrollToSection("contact")} className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 text-sm py-2 group" > Let's Connect{" "} <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" /> </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 px-6 lg:px-12 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
            <AnimatedSection className="lg:w-1/3">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Skillset</h2>
              <p className="text-gray-400 text-lg leading-relaxed"> With a strong foundation in both software engineering and data science, I bring the versatility to architect complete, end-to-end solutions. Whether it's building sleek interfaces, designing scalable systems, or extracting insights from data, I'm equipped to turn your vision into a high-impact reality. </p>
            </AnimatedSection>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[ { iconPath: "/icons/Front-End-Development.gif", title: "Frontend Development", description: "I build modern, responsive, and intuitive user interfaces using React, Next.js, and Tailwind CSS to create seamless user experiences.", }, { iconPath: "/icons/Backend-End-Developement.gif", title: "Backend Development", description: "I create robust, scalable backend systems and secure APIs that handle complex data flows and power high-performance applications.", }, { iconPath: "/icons/Data Science and AI.gif", title: "Data Science & AI", description: "Leveraging Python, I develop machine learning models and perform data analysis to uncover insights and drive data-informed decisions.", }, { iconPath: "/icons/Tech Content Creator.gif", title: "Tech Content Creator", description: "I build scalable, resilient software systems and create tech content across platforms like YouTube, where I share my journey, projects, and insights to educate and inspire others in tech.", }, ].map((area, index) => ( <AnimatedSection key={area.title} delay={index * 100} className="group"> <div className="mb-5 h-12 w-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"> <Image src={area.iconPath || "/placeholder.svg"} alt={`${area.title} icon`} width={48} height={48} className="object-contain" unoptimized={true} /> </div> <h3 className="text-2xl font-bold text-white mb-3">{area.title}</h3> <p className="text-gray-400 text-base leading-relaxed">{area.description}</p> </AnimatedSection> ))}
            </div>
          </div>
          <AnimatedSection delay={600} className="mt-28">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-4">Tech Stack</h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-12"> A curated stack driving both software development for crafting scalable systems and data science for turning raw data into impactful solutions. </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {skills.map((skill, index) => ( <AnimatedSection key={skill.name} delay={index * 100} className="p-6 rounded-lg border border-purple-800/50 bg-slate-800/30 transition-all duration-300 ease-in-out cursor-pointer hover:bg-slate-800/80 hover:border-purple-500 hover:scale-105 group" > <div className="flex items-center gap-4"> <div className="w-10 h-10 flex-shrink-0"> <Image src={skill.iconPath || "/placeholder.svg"} alt={`${skill.name} logo`} width={40} height={40} className="object-contain transition-transform duration-300 group-hover:scale-110" /> </div> <h4 className="font-semibold text-gray-300 text-lg">{skill.name}</h4> </div> </AnimatedSection> ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="projects" className="py-20 px-6 lg:px-12 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection> <div className="text-left mb-16"> <h2 className="text-3xl lg:text-4xl font-bold mb-4"> Projects <span className="text-purple-400">Highlights</span> </h2> <p className="text-lg text-gray-300"> Work that I've done for the past 2 years. This is a curated collection of my software development and data science projects. From intelligent web applications to data-driven platforms, each project reflects my commitment to building functional, user-focused, and scalable solutions using modern technologies. </p> </div> </AnimatedSection>
          <AnimatedSection delay={200}> <div className="flex justify-center mb-12"> <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 backdrop-blur-sm"> <Button onClick={() => setActiveProjectTab("all")} className={`px-6 py-2 rounded-lg transition-all text-sm ${ activeProjectTab === "all" ? "bg-purple-600 text-white shadow-lg" : "bg-transparent text-gray-400 hover:text-white" }`} > All Projects </Button> </div> </div> </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredProjects().map((project, index) => ( <AnimatedSection key={`${project.category}-${index}`} delay={index * 100}> <Card className="bg-slate-800/80 border-slate-700 hover:border-blue-600/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-600/20 group backdrop-blur-sm overflow-hidden"> <CardContent className="p-0"> <div className="relative overflow-hidden"> <Image src={project.image || "/placeholder.svg"} alt={project.title} width={400} height={250} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" /> <div className="absolute top-4 right-4"> <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold"> {project.category === "dev" ? "Dev" : "Data"} </span> </div> <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> </div> <div className="p-6"> <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-400 transition-colors"> {project.title} </h3> <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">{project.description}</p> <div className="flex flex-wrap gap-2 mb-6"> {project.tech.slice(0, 3).map((tech, techIndex) => ( <span key={techIndex} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full"> {tech} </span> ))} {project.tech.length > 3 && ( <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full"> +{project.tech.length - 3} more </span> )} </div> <div className="flex space-x-3"> <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg active:scale-95 text-xs group" onClick={() => handleProjectClick(project.id)} > <ExternalLink className="w-3 h-3 mr-1 transition-transform duration-300 group-hover:scale-110" />{" "} View Details </Button> <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 bg-transparent transition-all duration-300 active:scale-95 group" onClick={() => window.open(project.githubUrl, "_blank")} > <Github className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" /> </Button> </div> </div> </CardContent> </Card> </AnimatedSection> ))}
          </div>
          <AnimatedSection delay={800}> <div className="text-center mt-12"> <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-3 bg-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95 group" onClick={() => window.open("https://github.com/Kamau-Johnson", "_blank")} > <Github className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> View All Projects </Button> </div> </AnimatedSection>
        </div>
      </section>

      <section id="achievements" className="py-20 px-6 lg:px-12 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection> <div className="text-left mb-16"> <h2 className="text-3xl lg:text-4xl font-bold mb-4"> My <span className="text-purple-400">Achievements</span> </h2> <p className="text-lg text-gray-300 max-w-4xl leading-relaxed"> I am an avid hackathon enthusiast and have proudly represented my work in various competitions. These events have not only sharpened my skills under pressure but have also allowed me to collaborate with brilliant minds and build impactful solutions. </p> </div> </AnimatedSection>
          <div className="space-y-12 mb-16">
            <AnimatedSection delay={200}> <h3 className="text-2xl font-semibold text-left text-purple-400 mb-8">Track Record</h3> </AnimatedSection>
            <AnimatedSection delay={300}> <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 group"> <div className="flex items-start gap-4 mb-4"> <div> <h4 className="text-xl font-bold text-white mb-2">Power Hacks Hackathon - 4th Runners-Up</h4> <p className="text-purple-400 text-sm mb-3">October 2024 • First Hackathon Experience</p> </div> </div> <p className="text-gray-300 leading-relaxed mb-4"> In October 2024, I participated in my first hackathon, the{" "} <strong className="text-white">Power Hacks Hackathon</strong>, representing{" "} <strong className="text-white">SOSTOS Blog</strong>. Sponsored by PLP, Safaricom, SpaceYaTech, Payd, and others, we developed an app that verifies statement accuracy. I led full-stack development with HTML, CSS, JS, React Native, and PHP, delivering a user-friendly, secure platform that addressed misinformation. Despite being a first-time hackathon participant, we secured{" "} <strong className="text-white">4th Runners-Up</strong>, which fueled my passion for tech innovation. </p> </div> </AnimatedSection>
            <AnimatedSection delay={400}> <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300 group"> <div className="flex items-start gap-4 mb-4"> <div> <h4 className="text-xl font-bold text-white mb-2">Blockchain & Web3 Bootcamp - First Runners-Up</h4> <p className="text-green-400 text-sm mb-3">April 2025 • $1000 Prize Winner</p> </div> </div> <p className="text-gray-300 leading-relaxed mb-4"> In April 2025, I took part in a Blockchain and Web3 Bootcamp hosted by MUIAA, Nairobi County Government, and ComputerAid Kenya. We were introduced to{" "} <strong className="text-white">Cypherium Blockchain</strong>—a next-generation blockchain built for enterprise and CBDC integration. Alongside my teammates Risper, Mitau, and Keziah, we developed{" "} <strong className="text-white">BebaPay</strong>, a tokenized recycling platform. I was responsible for designing and implementing the smart contract layer. Our innovation earned us{" "} <strong className="text-white">First Runners-Up</strong> and a{" "} <strong className="text-white">$1000 cash prize</strong>. </p> <div className="bg-slate-700/50 p-4 rounded-lg mb-4"> <h5 className="font-semibold text-purple-400 mb-2">Key Takeaways:</h5> <ul className="text-sm text-gray-400 space-y-1"> <li>• Learned to build and deploy smart contracts using Cypherium's blockchain stack</li> <li>• Sharpened pitching techniques under pressure with clarity and confidence</li> </ul> </div> </div> </AnimatedSection>
          </div>
          <div className="space-y-8">
            <AnimatedSection delay={600}> <h3 className="text-2xl font-semibold text-center text-purple-400 mb-8">Moments from the Journey</h3> </AnimatedSection>
            <AnimatedSection delay={700}> <div className="relative group"> <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div> <div className="relative overflow-hidden rounded-2xl border-2 border-slate-700 group-hover:border-purple-600/50 transition-all duration-300"> <Image src="/BebaPay Hackathon.webp" alt="BebaPay Hackathon - First Runners-Up Achievement" width={1200} height={600} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" /> <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> <h4 className="text-white font-semibold">BebaPay Hackathon Victory</h4> <p className="text-gray-300 text-sm">First Runners-Up • $1000 Prize</p> </div> </div> </div> </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection delay={800}> <div className="relative group"> <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div> <div className="relative overflow-hidden rounded-xl border-2 border-slate-700 group-hover:border-blue-600/50 transition-all duration-300"> <Image src="/Power Hacks Hackathon.webp" alt="Power Hacks Hackathon - 4th Runners-Up" width={600} height={400} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" /> <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> <h4 className="text-white font-semibold">Power Hacks Hackathon</h4> <p className="text-gray-300 text-sm">4th Runners-Up</p> </div> </div> </div> </AnimatedSection>
              <AnimatedSection delay={900}> <div className="relative group"> <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div> <div className="relative overflow-hidden rounded-xl border-2 border-slate-700 group-hover:border-green-600/50 transition-all duration-300"> <Image src="/Blockchain Bootcamp 1.webp" alt="Blockchain Bootcamp Experience" width={600} height={400} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" /> <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"> <h4 className="text-white font-semibold"> Blockchain Bootcamp (MUIAA, Nairobi County & Computer Aid) </h4> <p className="text-gray-300 text-sm">Web3 & Smart Contracts Learning</p> </div> </div> </div> </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7e5fc] grid grid-cols-1 md:grid-cols-2 gap-10" id="blog">
        <AnimatedSection className="p-6 md:p-0">
          <h1 className="text-5xl font-bold pt-16 md:pl-14 text-black">Medium</h1>
          <p className="text-[#5b6876] mt-6 md:pl-14" style={{ fontSize: "18px", lineHeight: "150%" }}> I am a technical writer, developer, and curious learner documenting my journey in software development and data science. I share what I learn through writing that turns complex ideas into clear, relatable insights. My blog is a space where I explore new concepts, build real-world projects, and reflect on the process behind them the decisions, tools, challenges, and breakthroughs. By sharing both my growth and my work, I aim to educate, inspire, and support others who are learning and building in tech. </p>
          <a href="https://medium.com/@Kamau_Johnson"> <button className="hover:bg-[#4c24dd] text-black py-2 mt-10 md:ml-14 border-b-2 border-[#000] hover:px-6 transition duration-300 ease-in-out hover:text-white"> Follow me on medium </button> </a>
        </AnimatedSection>
        <AnimatedSection delay={300} className="flex items-center justify-center p-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-slate-800/80 p-8 rounded-lg border border-purple-600/20 shadow-2xl backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center space-x-3"> <div className="w-3 h-3 bg-red-500 rounded-full"></div> <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> <div className="w-3 h-3 bg-green-500 rounded-full"></div> <div className="flex-1 bg-slate-700 h-6 rounded ml-4"></div> </div>
                <div className="space-y-4"> <div className="h-8 bg-purple-600/30 rounded animate-pulse"></div> <div className="space-y-2"> <div className="h-3 bg-slate-600 rounded animate-pulse"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-4/5"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-3/4"></div> </div> <div className="h-20 bg-slate-700 rounded animate-pulse"></div> <div className="space-y-2"> <div className="h-3 bg-slate-600 rounded animate-pulse"></div> <div className="h-3 bg-slate-600 rounded animate-pulse w-5/6"></div> </div> </div>
                <div className="flex items-center space-x-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-400 animate-bounce" > <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"></path> <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"></path> <path d="m2.3 2.3 7.286 7.286"></path> <circle cx="11" cy="11" r="2"></circle> </svg> <div className="text-purple-400 text-sm">Writing amazing content...</div> <div className="flex space-x-1"> <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping"></div> <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "0.2s" }} ></div> <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: "0.4s" }} ></div> </div> </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="contact" className="py-20 px-6 lg:px-12 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection> <div className="text-left mb-16"> <h2 className="text-3xl lg:text-4xl font-bold mb-4"> Let's Talk <span className="text-purple-400">Tech</span> </h2> <p className="text-lg text-gray-300">Tech in motion. Story in progress.</p> </div> </AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection delay={200} className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-6">Let's Connect</h3>
                <p className="text-gray-300 leading-relaxed mb-6 text-sm"> Big idea brewing? Let's bring it to life. Whether it's a high impact page or a data driven system bold enough for Elon Musk level dreams, I'm all in. Reach out ! </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 group"> <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300"> <Mail className="w-5 h-5 text-purple-400" /> </div> <div> <p className="font-semibold text-sm">Email</p> <a href="mailto:johnsonkamau542@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors text-sm" > johnsonkamau542@gmail.com </a> </div> </div>
                <div className="flex items-center space-x-4 group"> <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300"> <Phone className="w-5 h-5 text-purple-400" /> </div> <div> <p className="font-semibold text-sm">Phone</p> <a href="tel:+254768280952" className="text-purple-400 hover:text-purple-300 transition-colors text-sm" > +254 768280952 </a> </div> </div>
                <div className="flex items-center space-x-4 group"> <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-all duration-300"> <MapPin className="w-5 h-5 text-purple-400" /> </div> <div> <p className="font-semibold text-sm">Location</p> <p className="text-gray-300 text-sm">Nairobi, Kenya</p> </div> </div>
              </div>
              <div className="pt-6">
                <h4 className="font-semibold mb-4 text-sm">Follow Me</h4>
                <div className="flex space-x-4">
                  {[ { href: "https://www.linkedin.com/in/kamau-johnson-4bab25276/", icon: Linkedin, color: "hover:bg-blue-600 hover:border-blue-600", label: "LinkedIn Profile", }, { href: "https://github.com/Kamau-Johnson", icon: Github, color: "hover:bg-purple-600 hover:border-purple-600", label: "GitHub Profile", }, { href: "https://www.youtube.com/@Kamau_Johnson", icon: Play, color: "hover:bg-red-600 hover:border-red-600", label: "YouTube Channel", }, { href: "https://medium.com/@Kamau_Johnson", icon: MessageCircle, color: "hover:bg-green-600 hover:border-green-600", label: "Medium Profile", }, ].map((social, index) => ( <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} > <Button size="icon" className={`bg-slate-800 border border-slate-700 transition-all duration-300 hover:-translate-y-1 active:scale-95 ${social.color}`} > <social.icon className="w-4 h-4" /> </Button> </a> ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={400} className="space-y-8">
              <div className="flex justify-center mb-8">
                <div className="relative group"> <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-xl opacity-30 animate-pulse"></div> <Image src="/contact-image.webp" alt="Contact Animation" width={400} height={300} className="relative rounded-lg shadow-2xl border-2 border-purple-600/20 transition-transform duration-300 group-hover:scale-105" /> </div>
              </div>
              <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm hover:border-purple-600/50 transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">Send Me a Message</h3>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 lg:px-12 border-t border-slate-800 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2025 Kamau <Heart className="inline w-4 h-4 text-red-500" /> Johnson. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-7">
              <h4 className="font-semibold text-sm text-gray-300 hidden sm:block"></h4>
              <div className="flex space-x-4">
                {footerSocials.map((social, index) => (
                  <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} >
                    <Button size="icon" className={`bg-slate-800 border border-slate-700 text-white transition-all duration-300 hover:-translate-y-1 active:scale-95 ${social.color}`} >
                      <social.icon className="w-4 h-4" />
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && ( <Button onClick={scrollToTop} className="fixed bottom-2 right-6 bg-purple-600 hover:bg-purple-700 p-3 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 z-40 group" size="icon" > <Image src="/Scroll Cursor.gif" alt="Scroll to top" width={32} height={20} className="w-8 h-5 object-contain transition-transform duration-300 group-hover:scale-100" /> </Button> )}
    </div>
  )
}