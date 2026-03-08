
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				'2xl': '1320px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				cosmic: {
					'indigo': 'hsl(245 45% 50%)',
					'violet': 'hsl(255 25% 15%)',
					'gold': 'hsl(var(--cosmic-gold))',
					'silver': 'hsl(220 12% 70%)',
					'star': 'hsl(220 20% 95%)',
					'deep-space': 'hsl(230 25% 5%)',
					'purple': 'hsl(var(--cosmic-purple))',
					'pink': 'hsl(var(--cosmic-pink))',
					'blue': 'hsl(var(--cosmic-blue))',
				},
				'love-pink': 'hsl(var(--love-pink))',
				'love-purple': 'hsl(var(--love-purple))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' },
				},
				'glow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(6px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(14px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.96)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(16px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'spin-slow': 'spin-slow 20s linear infinite',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
				'scale-in': 'scale-in 0.35s ease-out forwards',
				'slide-up': 'slide-up 0.5s ease-out forwards',
				'shimmer': 'shimmer 2s linear infinite',
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
				'heading': ['"Plus Jakarta Sans"', 'sans-serif'],
				'display': ['"Plus Jakarta Sans"', 'sans-serif'],
				'cinzel': ['"Plus Jakarta Sans"', 'sans-serif'],
				'lora': ['Inter', 'sans-serif'],
				'cormorant': ['"Plus Jakarta Sans"', 'sans-serif'],
				'noto-sans': ['"Noto Sans"', 'sans-serif'],
				'noto-devanagari': ['"Noto Sans Devanagari"', 'sans-serif'],
				'playfair': ['"Plus Jakarta Sans"', 'sans-serif'],
			},
			backgroundImage: {
				'cosmic-gradient': 'linear-gradient(170deg, var(--tw-gradient-stops))',
				'star-field': 'radial-gradient(circle, hsla(220, 20%, 95%, 0.04) 1px, transparent 1px)',
				'glass-gradient': 'linear-gradient(135deg, hsla(255, 22%, 14%, 0.4), hsla(230, 22%, 7%, 0.6))',
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
