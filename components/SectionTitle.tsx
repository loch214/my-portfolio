import { IconType } from "react-icons";

interface SectionTitleProps {
  icon: IconType;
  title: string;
}

const SectionTitle = ({ icon: Icon, title }: SectionTitleProps) => {
  return (
    <h2 className="flex items-center justify-center text-3xl md:text-4xl font-bold gap-x-3 text-center">
      <Icon className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" />
      <span className="bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
        {title}
      </span>
    </h2>
  );
};

export default SectionTitle;
