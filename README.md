My Personal Portfolio

This repository contains the source code for my personal portfolio website, which you can view live at: lochd-my-portfolio.vercel.app
This project is a stunning, modern, and interactive personal website built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. It was created to showcase my skills and passions, and has been deployed for free using a modern Git-based workflow.

Tech Stack
Framework: Next.js 14
Language: TypeScript
Styling: Tailwind CSS
Animations: Framer Motion
Icons: Lucide React
Scroll Animations: React Intersection Observer

Deployment: From Local to Live for Free
This website was built locally and deployed to the web using a simple, modern, and completely free workflow.
1.Code Storage: The entire project was pushed to this GitHub repository.
2.Hosting Platform: Vercel was connected to the GitHub repository.
3.Automatic Deployments: Vercel automatically detected that this is a Next.js project. It builds and deploys the site whenever new code is pushed to the main branch.
This setup ensures that the website is always up-to-date with the latest changes in the code, with no manual upload process required.



Getting Started (for developers)
*Prerequisites
Node.js 18+ installed
npm, yarn, or pnpm package manager
*Installation
1.Clone the repository and install dependencies:
git clone https://github.com/loch214/my-portfolio.git
cd my-portfolio
npm install

2.Run the development server:
npm run dev

3.Open http://localhost:3000 or 3001 in your browser to see the result.


Customization
All personal information is stored in a central data file, making it easy to customize.
Main Content: Edit data/personalData.ts to update your name, bio, education, sports, skills, and social media links.
Art Gallery: To update the gallery, add your image files to the public/art/ directory. Then, edit the artData array in data/personalData.ts to include the correct filenames and titles for your pieces.
