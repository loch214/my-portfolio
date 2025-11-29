import type { IconType } from 'react-icons';
import { FaBook, FaCar, FaHeartbeat, FaUser, FaMusic, FaChalkboardTeacher, FaSearch, FaShieldAlt, FaEnvelopeOpenText } from 'react-icons/fa';
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

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  icon: IconType;
  githubUrl: string;
  media: ProjectMedia[];
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
    instruments: ["Experienced with the organ and guitar. Also have a basic understanding of the piano and violin."],
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

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Chapterly E-commerce Bookstore",
    description: "Chapterly Bookstore was my first real shot at building a full-stack app on my own. It’s basically an online bookstore where you can browse, add items to a cart, and check out. Since I was still learning and didn't know much about databases, I didn't use a real one—I just saved data in memory or files. That made it pretty limited, but it helped me understand how to connect the frontend to the backend and manage user actions.",
    tags: ["Java", "Spring Boot", "Thymeleaf", "MySQL", "Maven"],
    icon: FaBook,
    githubUrl: "https://github.com/loch214/Chapterly-Bookstore",
    media: [
      { type: 'video', url: 'https://www.youtube.com/embed/7IeUJAgBgwY', caption: 'A full video walkthrough of the Chapterly Bookstore.' },
    ]
  },
  {
    id: 2,
    title: "Learn Mate System",
    description: "This is the project I built for the Year 2 Semester 1 SE2030 module. It's a simple management platform with separate dashboards for students, teachers, and admins. The main focus was on role-based access and actions, so each type of user only sees and does what they are allowed to inside the system.",
    tags: ["Java", "Spring Boot", "Thymeleaf", "MySQL"],
    icon: FaChalkboardTeacher,
    githubUrl: "https://github.com/loch214/learn-mate-system",
    media: [
      { type: 'video', url: 'https://www.youtube.com/embed/B6u5wYHMLtw', caption: 'Full walkthrough showing role-based flows inside Learn Mate.' },
    ]
  },
  {
    id: 3,
    title: "Car Brand Detection API",
    description: "This was an experiment to see if I could build and deploy a real-time AI service entirely on my own. The biggest challenge by far was training a YOLOv5 model on my personal laptop. With a limited dataset and hardware, the model's accuracy is not high enough for a production environment. However, i did engineering the complete pipeline: training the model, diagnosing its weaknesses, and deploying it as a stable REST API using FastAPI.",
    tags: ["Python", "FastAPI", "YOLOv5", "PyTorch", "Computer Vision"],
    icon: FaCar,
    githubUrl: "https://github.com/loch214/car-brand-detection-API",
    media: [
      { type: 'video', url: 'https://www.youtube.com/embed/XdOVrvLiZUE', caption: 'Live demo showing the API identifying car brands in real-time.' },
      { type: 'video', url: 'https://www.youtube.com/embed/-Wu_t6wKU9w', caption: 'Short video covering the 150-epoch model training workflow.' },
    ]
  },
  {
    id: 4,
    title: "AI Diabetes Prediction",
    description: "I built this during our second-year AIML module as a first try at a full machine learning pipeline. I used a Random Forest model and got around 90% accuracy, but that only came after a lot of data cleaning, preprocessing, and tuning with GridSearchCV. Most of the work was actually on getting the dataset into a usable state before training.",
    tags: ["Python", "Machine Learning", "Scikit-learn", "Random Forest"],
    icon: FaHeartbeat,
    githubUrl: "https://github.com/loch214/AI-Diabetes-Prediction",
    media: [
      { type: 'video', url: 'https://www.youtube.com/embed/UjL3vI7j3Bk', caption: 'Google Colab run-through from dataset upload to live predictions.' },
    ]
  },
  {
    id: 5,
    title: "Song Genre Classifier",
    description: "This project turned out to be a fantastic lesson in the difficulty of machine learning. The goal was to classify songs into 10 genres, but the final model's accuracy topped out around 65%—far from reliable. It frequently confused similar genres like rock and metal. The low performance wasn't a failure, but a discovery: classifying something as subjective as music requires more than standard features. This project taught me more from its shortcomings than any success could have, highlighting the critical importance of feature engineering and the need for deep learning on complex, nuanced data.",
    tags: ["Python", "Machine Learning", "Streamlit", "Librosa", "Scikit-learn"],
    icon: FaMusic,
    githubUrl: "https://github.com/loch214/Song-GenreClassifier",
    media: [
      { type: 'video', url: 'https://youtube.com/embed/your-video-id', caption: 'A video showing the Streamlit app classifying different songs.' },
      { type: 'image', url: '/projects/genre-1.png', caption: 'The user interface of the genre classification app.' },
    ]
  },
  {
    id: 6,
    title: "Personal Portfolio Website",
    description: "This portfolio started as a side project to learn Next.js, TypeScript, Tailwind CSS, and Framer Motion properly. I designed the layout myself and kept iterating on the animations and sections until it felt smooth and easy to read. I also set it up on Vercel so I can push changes from GitHub and see them live without any extra steps.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    icon: FaUser,
    githubUrl: "https://github.com/loch214/my-portfolio",
    media: [
      { type: 'image', url: '/projects/portfolio-1.png', caption: 'The main landing page of the portfolio.' },
    ]
  },
  {
    id: 7,
    title: "Lens Lock Metadata Tool",
    description: "Lens-Lock is a digital privacy tool that scans images for hidden metadata like GPS coordinates and device details. Users can visualize the location on a map and download a sanitized \"safe\" version with the data removed. Built with Java Spring Boot, React, and Tailwind CSS.",
    tags: ["Java", "Spring Boot", "React", "Tailwind CSS", "Privacy"],
    icon: FaShieldAlt,
    githubUrl: "https://github.com/loch214/lens-lock-metadata-tool",
    media: []
  },
  {
    id: 8,
    title: "Phish-Hawk",
    description: "This tool analyzes suspicious emails to spot phishing attempts. A user can upload an email file (.eml, .pdf) or paste its raw text. The application then scans for common red flags. It checks for technical issues like faked sender addresses and misleading links that point to different domains than the sender's. It also uses Apache PDFBox to read and analyze the text inside PDF attachments. The backend is built with Java and Spring Boot, serving a REST API. The frontend is a simple static page using HTML, CSS, and vanilla JavaScript to interact with the API. The main limitation is its reliance on a fixed keyword list, which can incorrectly flag legitimate emails (false positives). The next step is to replace this keyword-based logic with a trained AI model that can understand the context of the email for more accurate threat detection.",
    tags: ["Java", "Spring Boot", "HTML", "CSS", "JavaScript", "Apache PDFBox", "Security"],
    icon: FaEnvelopeOpenText,
    githubUrl: "https://github.com/loch214/Phish-Hawk",
    media: []
  }
];

