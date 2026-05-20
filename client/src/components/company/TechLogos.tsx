// Technology logos as SVG components
export const TechLogos = {
  React: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1" fill="none" transform="rotate(120 12 12)" />
    </svg>
  ),
  
  TypeScript: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#3178C6" />
      <path d="M12 9v10m-5-7h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 16.5c.5.5 1.5 1 2.5 1s2-1 2-2-1-1.5-2-2-2-1-2-2 1-2 2-2 2 .5 2.5 1" stroke="white" strokeWidth="1" fill="none" />
    </svg>
  ),
  
  Python: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 2c-2.2 0-4 1.8-4 4v2h4v1H6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2v-3c0-1.1.9-2 2-2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2z" fill="#3776AB" />
      <path d="M12 22c2.2 0 4-1.8 4-4v-2h-4v-1h6c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2v3c0 1.1-.9 2-2 2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2z" fill="#FFD43B" />
    </svg>
  ),
  
  NodeJS: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#339933" strokeWidth="1.5" fill="none" />
      <path d="M12 12v10M3 7l9 5 9-5" stroke="#339933" strokeWidth="1.5" />
    </svg>
  ),
  
  PostgreSQL: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <ellipse cx="12" cy="12" rx="8" ry="10" fill="#336791" />
      <path d="M12 4v16M8 12h8" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="2" fill="white" />
    </svg>
  ),
  
  MongoDB: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 3l-3 6v8l3 4 3-4v-8l-3-6z" fill="#47A248" />
      <path d="M12 17v4" stroke="#47A248" strokeWidth="2" />
    </svg>
  ),
  
  Docker: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <rect x="3" y="9" width="3" height="3" fill="#2496ED" />
      <rect x="7" y="9" width="3" height="3" fill="#2496ED" />
      <rect x="11" y="9" width="3" height="3" fill="#2496ED" />
      <rect x="7" y="6" width="3" height="2" fill="#2496ED" />
      <rect x="11" y="6" width="3" height="2" fill="#2496ED" />
      <path d="M3 12h18c0 2-2 4-6 4H9c-4 0-6-2-6-4z" fill="#2496ED" />
    </svg>
  ),
  
  Kubernetes: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 2l2 4 4 2-2 4 2 4-4 2-2 4-2-4-4-2 2-4-2-4 4-2 2-4z" fill="#326CE5" stroke="#326CE5" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  ),
  
  GraphQL: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M12 2l9 5.5v11L12 24l-9-5.5v-11L12 2z" stroke="#E10098" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" fill="#E10098" />
    </svg>
  ),
  
  NextJS: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" fill="black" />
      <path d="M8 8l8 12M16 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  
  VueJS: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <path d="M2 4h5l5 8 5-8h5l-10 16L2 4z" fill="#42B883" />
      <path d="M7 4h3l2 3 2-3h3l-5 8-5-8z" fill="#35495E" />
    </svg>
  ),
  
  Go: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
      <ellipse cx="14" cy="12" rx="8" ry="4" fill="#00ADD8" />
      <ellipse cx="10" cy="12" rx="3" ry="2" fill="white" />
      <path d="M2 12h6M2 14h4M2 10h4" stroke="#00ADD8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
};
