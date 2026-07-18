export const skillGroups = [
  {
    label: "Languages",
    items: ["C++", "JavaScript (ES6+)", "TypeScript", "SQL", "HTML5", "CSS3"],
  },
  {
    label: "Frontend",
    items: [
      "React.js",
      "Next.js (App Router)",
      "Tailwind CSS",
      "Zustand",
      "Framer Motion",
      "Leaflet",
    ],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Auth"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "Supabase", "MongoDB", "Firebase Firestore"],
  },
  {
    label: "Auth & Tools",
    items: [
      "Supabase Auth",
      "Google OAuth",
      "Email/Phone OTP",
      "Git",
      "GitHub",
      "Postman",
      "Vercel",
    ],
  },
  {
    label: "AI & APIs",
    items: ["Google Gemini API", "Vapi AI", "Judge0 API"],
  },
];

export const projects = [
  {
    name: "Hangr",
    tagline: "Hyperlocal social networking platform",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "Supabase",
      "Zustand",
      "Tailwind CSS",
      "Leaflet",
    ],
    points: [
      "Discover and connect with nearby people based on shared interests and location.",
      "Secure auth via Supabase — Email/Phone OTP and Google OAuth — with a personalized onboarding flow.",
      "Realtime group chat built on Supabase Realtime for instant, live conversations.",
      "Community feed (posts, comments, interactions) on PostgreSQL, plus Leaflet maps for nearby users and verified spots.",
      "A lightweight Ping system and a trust-score / verified-spots system to encourage authentic connections.",
    ],
  },
  {
    name: "MindMash",
    tagline: "Real-time coding battle platform",
    stack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "Judge0 API",
      "JWT",
    ],
    points: [
      "Real-time multiplayer coding battles supporting multiple programming languages.",
      "JWT-based authentication, room management, and scalable APIs for contests and matchmaking.",
      "Judge0 API integration for code execution and evaluation, synced live over Socket.IO.",
      "Monaco Editor embedded for an IDE-like in-browser coding experience.",
    ],
  },
  {
    name: "GyanSetu",
    tagline: "AI-powered gamified learning platform",
    stack: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
      "Gemini API",
      "Vapi AI",
    ],
    points: [
      "AI-powered educational platform with gamified learning and role-based auth for students and teachers.",
      "Google Gemini API for AI-generated quizzes and content; Vapi AI for voice interaction.",
      "Leaderboards, XP tracking, achievements, and progress dashboards with a responsive, mobile-friendly UI.",
    ],
  },
];

export const stats = [
  { value: 3, suffix: "", label: "Featured projects" },
  { value: 15, suffix: "+", label: "Technologies used" },
  { value: 2028, suffix: "", label: "Expected grad" },
];

export const links = {
  email: "alok020505@gmail.com",
  emailCompose:
    "https://mail.google.com/mail/?view=cm&fs=1&to=alok020505@gmail.com",
  github: "https://github.com/GuTS805",
  githubLabel: "github.com/GuTS805",
  linkedin: "https://linkedin.com/in/alok-srivastava-7a6391329",
  linkedinLabel: "linkedin.com/in/alok-srivastava-7a6391329",
};
