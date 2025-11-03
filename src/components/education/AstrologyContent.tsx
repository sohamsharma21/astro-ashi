
import { CardContent } from '@/components/ui/card';

interface AstrologyContentProps {
  title: string;
  description: string;
  content: string;
}

const AstrologyContent = ({ title, description, content }: AstrologyContentProps) => {
  return (
    <div>
      <h3 className="text-xl text-cosmic-gold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
};

export default AstrologyContent;
