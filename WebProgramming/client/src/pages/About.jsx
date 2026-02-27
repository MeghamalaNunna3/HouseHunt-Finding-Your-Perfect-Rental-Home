import React, { useState, useEffect } from 'react';

// This component creates the interactive, animated background effect.
const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const parallax = (speed) => {
    const x = (window.innerWidth - mousePosition.x * speed) / 100;
    const y = (window.innerHeight - mousePosition.y * speed) / 100;
    return { transform: `translateX(${x}px) translateY(${y}px)` };
  };

  return (
    <div className="absolute inset-0 -z-10" style={parallax(1)}>
      <div className="shape shape-1" style={parallax(2)}></div>
      <div className="shape shape-2" style={parallax(4)}></div>
      <div className="shape shape-3" style={parallax(6)}></div>
      <div className="shape shape-4" style={parallax(3)}></div>
    </div>
  );
};

// A reusable component for team member cards
const TeamMemberCard = ({ name, role, description, imageUrl }) => (
  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
    <img
      src={imageUrl}
      alt={`Profile of ${name}`}
      className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
    />
    <h3 className="text-xl font-bold text-slate-800">{name}</h3>
    <p className="text-indigo-600 font-semibold">{role}</p>
    <p className="text-slate-600 mt-2 text-sm">{description}</p>
  </div>
);

export default function About() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 overflow-hidden py-16 px-4">
      <AnimatedBackground />

      {/* --- Main Content Container --- */}
      <div className="relative z-10 animate-fadeInUp">
        {/* --- Mission Statement Section --- */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 mb-4">
            The Team Behind Your Trust
          </h1>
          <p className="text-lg md:text-xl text-slate-600">
            At SafeHouse, we're more than just a platform; we're a dedicated team of professionals committed to ensuring your peace of mind. Our diverse expertise and shared passion for security and innovation drive us to create the safest, most reliable experience for finding your next home.
          </p>
        </div>

        {/* --- Meet The Team Section --- */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Meet Our Experts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMemberCard
              name="ASaduzzaman"
              role="Full Stack Developer"
              description="The chief architect of our platform, building both the robust backend and the seamless frontend experience from the ground up."
              imageUrl="https://placehold.co/200x200/31343C/FFFFFF?text=AS"
            />
            <TeamMemberCard
              name="Sumaiya Nasir Oyshi"
              role="Project Manager"
              description="The strategic leader who guides our vision, ensuring every feature aligns with our mission and is delivered to the highest standard."
              imageUrl="https://placehold.co/200x200/6366f1/FFFFFF?text=SN"
            />
            <TeamMemberCard
              name="Limu Akter"
              role="Backend Developer"
              description="The powerhouse behind our server-side logic, building the secure and efficient infrastructure that powers our entire application."
              imageUrl="https://placehold.co/200x200/8b5cf6/FFFFFF?text=LA"
            />
            <TeamMemberCard
              name="Tanvirul Islam"
              role="UI/UX Designer & Frontend Helper"
              description="The creative force who designs our user-friendly interfaces and helps bring them to life with elegant, intuitive code."
              imageUrl="https://placehold.co/200x200/10b981/FFFFFF?text=TI"
            />
            <TeamMemberCard
              name="MD Hafiz Sheikh"
              role="QA & Tester"
              description="Our meticulous quality guardian, dedicated to rigorously testing every aspect of our platform to ensure a bug-free and reliable experience."
              imageUrl="https://placehold.co/200x200/f59e0b/FFFFFF?text=HS"
            />
            <TeamMemberCard
              name="Mahfuza Akter Eti"
              role="QA & Tester"
              description="Our detail-oriented expert who identifies and helps resolve issues, guaranteeing that our final product is stable, secure, and ready for you."
              imageUrl="https://placehold.co/200x200/ec4899/FFFFFF?text=ME"
            />
          </div>
        </div>
      </div>

      <style>{`
        .shape {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, rgba(129, 140, 248, 0) 70%);
          transition: transform 0.2s ease-out;
          animation: float 15s infinite ease-in-out alternate;
        }
        .shape-1 { width: 250px; height: 250px; top: 10%; left: 15%; animation-duration: 18s; }
        .shape-2 { width: 150px; height: 150px; top: 25%; right: 10%; animation-duration: 12s; animation-delay: 2s; }
        .shape-3 { width: 300px; height: 300px; bottom: 10%; left: 20%; animation-duration: 20s; }
        .shape-4 { width: 100px; height: 100px; bottom: 20%; right: 25%; animation-duration: 10s; animation-delay: 3s; }

        @keyframes float {
          0% { transform: translateY(20px) translateX(0px) scale(1); }
          50% { transform: translateY(-20px) translateX(20px) scale(1.05); }
          100% { transform: translateY(20px) translateX(0px) scale(1); }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
            animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}