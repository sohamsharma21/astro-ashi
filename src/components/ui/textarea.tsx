
import * as React from "react"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  languagePlaceholder?: {
    en: string;
    hi: string;
  };
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, languagePlaceholder, placeholder, ...props }, ref) => {
    // Get the current language from auth context
    let { language } = { language: 'en' };
    try {
      // This will work when the component is used within the AuthProvider
      const auth = useAuth();
      language = auth.language;
    } catch (error) {
      // Fallback to localStorage if outside AuthProvider
      language = localStorage.getItem('preferred_language') === 'hi' ? 'hi' : 'en';
    }

    // Determine the correct placeholder based on language
    const effectivePlaceholder = languagePlaceholder
      ? languagePlaceholder[language]
      : placeholder;

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        placeholder={effectivePlaceholder}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
