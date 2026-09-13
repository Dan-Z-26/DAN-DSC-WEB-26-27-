import SideRays from './SideRays';
import TechParticles from './TechParticles';

export default function TechStackMarquee() {
  const techStacks = [
    { name: "REACT", desc: "Frontend library" },
    { name: "NODE.JS", desc: "Backend runtime" },
    { name: "PYTHON", desc: "Data science & AI" },
    { name: "TENSORFLOW", desc: "Machine learning" },
    { name: "DOCKER", desc: "Containerization" },
    { name: "KUBERNETES", desc: "Orchestration" },
    { name: "AWS", desc: "Cloud computing" },
    { name: "FIGMA", desc: "UI/UX Design" },
    { name: "ASTRO", desc: "Web framework" },
    { name: "TYPESCRIPT", desc: "Typed JavaScript" },
    { name: "NEXT.JS", desc: "React framework" },
    { name: "GIT", desc: "Version control" },
    { name: "MONGODB", desc: "NoSQL database" },
    { name: "POSTGRESQL", desc: "Relational database" },
    { name: "FIREBASE", desc: "BaaS platform" },
    { name: "FLUTTER", desc: "Mobile development" },
    { name: "KOTLIN", desc: "Android development" },
    { name: "SWIFT", desc: "iOS development" },
  ];

  // Duplicate for seamless loop
  const marqueeItems = [...techStacks, ...techStacks];

  return (
    <section className="tech-stack-section">
      {/* Background — SideRays + TechParticles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <SideRays
            speed={1.2}
            rayColor1="#1dd1a1"
            rayColor2="#00f2fe"
            intensity={1.2}
            spread={2.5}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={0.65}
          />
        </div>
        <TechParticles />
      </div>

      <div className="tech-stack-container">
        
        {/* Left side: Vertical Marquee */}
        <div className="tech-stack-marquee-wrapper">
          <div className="tech-stack-fade-top"></div>
          <div className="tech-stack-fade-bottom"></div>
          
          <div className="tech-stack-marquee-content">
            {marqueeItems.map((item, index) => (
              <div className="tech-stack-item" key={index}>
                <span className="tech-stack-name">{item.name}</span>
                <span className="tech-stack-desc">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Content */}
        <div className="tech-stack-info">
          <h2 className="tech-stack-heading">
            Technology keeps advancing.<br />
            We make sure you lead.
          </h2>
          <a href="/contact" className="tech-stack-btn">
            Join the community
          </a>
        </div>

      </div>
      
      {/* Decorative Bottom Graphic */}
      <div className="tech-stack-bottom-graphic"></div>
    </section>
  );
}
