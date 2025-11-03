import { Link, useLocation } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IconNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  displayMode: 'icons' | 'text' | 'both';
}

export const IconNavLink = ({ to, icon: Icon, label, displayMode }: IconNavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-all duration-300 ${
        isActive
          ? 'text-cosmic-gold bg-cosmic-violet bg-opacity-20 shadow-glow'
          : 'text-white hover:text-cosmic-gold hover:bg-cosmic-deep-space hover:bg-opacity-40'
      }`}
    >
      <Icon className="h-5 w-5" />
      {displayMode !== 'icons' && <span>{label}</span>}
    </Link>
  );

  if (displayMode === 'icons') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-cosmic-deep-space border-cosmic-gold text-cosmic-gold"
          >
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
};
