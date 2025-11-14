export interface PersonalData {
  name: string;
  title: string;
  bio: string;
  introduction: string;
  education: {
    school: string;
    degree: string;
    period: string;
    location?: string;
    stream?: string;
    description: string;
    resultsPdf?: string;
  }[];
  sports: {
    name: string;
    achievements: string;
    duration: string;
    years?: string;
  }[];
  music: {
    instruments: string[];
    singing: string;
    listening: string;
  };
  art: {
    mediums: string[];
    achievements: string;
  };
  clubs: {
    name: string;
    organization: string;
    role: string;
    period: string;
    highlights: string[];
  }[];
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export interface ArtPiece {
  id: number;
  title: string;
  imageUrl: string;
}

export const personalData: PersonalData = {
  name: "Lochana Kavindu Dahanayake",
  title: "Student | Developer | Musician",
  bio: "Passionate about technology, music, and sports. Always like learning and exploring new skills.",
  introduction: "I'm driven by my passions for technology, music, and sports. I find that the focus and creativity from music and the discipline from sports are a natural fit for my work as a developer. Balancing these areas helps me stay motivated and approach challenges from different perspectives.",
  education: [
    {
      school: "D.S. Senanayake College",
      degree: "Advanced Level (A/L)",
      period: "2023",
      location: "Colombo 7, Sri Lanka",
      stream: "Commerce Stream",
      description: "Completed Advanced Level examinations in Commerce stream. This curriculum provided a strong foundation for my higher education and offered valuable insights into business and economic environments."
    },
    {
      school: "SLIIT (Sri Lanka Institute of Information Technology)",
      degree: "BSc (Hons) in Information Technology, Specialising in Software Engineering",
      period: "2024 - Present",
      location: "Sri Lanka",
      description: "Currently pursuing a BSc (Hons) in Information Technology, Specialising in Software Engineering. My hands-on project work involves Java and Spring Boot, where I am applying academic knowledge to solve real-world problems for now.",
      resultsPdf: "/results.pdf"
    }
  ],
  sports: [
    {
      name: "Swimming",
      achievements: "Competed at the national level by representing my school in All Sri Lanka Inter-School Tournaments, demanded consistent training and preparation throughout the two-year period.",
      duration: "2 years",
      years: "2014 - 2015"
    },
    {
      name: "Cricket",
      achievements: "Played for the Under-13 A team and Under-15 C Team over a five-year period. Participating in numerous school cricket tournaments was a great experience in learning about teamwork, sportsmanship and sports skills.",
      duration: "5 years",
      years: "2014 - 2019"
    }
  ],
  music: {
    instruments: ["Organ", "Piano", "Guitar"],
    singing: "A passion for singing, with a comfortable range in low and mid notes. Current practice is focused on exploring higher pitches to continuously improve vocal technique.",
    listening: "A mix of both Sinhala and English music including soft indie, alternative pop, and pop."
  },
  art: {
    mediums: ["Pencil Arts", "Pastels"],
    achievements: "My passion for art, expressed through working with pencil and pastels, has led to winning titles in several art competitions throughout my school career."
  },
  clubs: [],
  socialLinks: [
    {
      platform: "GitHub",
      url: "https://github.com/loch214",
      icon: "github"
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/lochana-dahanayake-211034372",
      icon: "linkedin"
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/loch._.d?igsh=MTN4dzFyem9iMDNleA==",
      icon: "instagram"
    }
  ]
};

export const artData: ArtPiece[] = [
  {
    id: 1,
    title: "Pencil Sketch on Paper",
    imageUrl: "/art/piece1.jpeg"
  },
  {
    id: 2,
    title: "Digital Abstract Art",
    imageUrl: "/art/piece2.png"
  },
  {
    id: 3,
    title: "Pastel Landscape",
    imageUrl: "/art/piece3.jpeg"
  }
];

