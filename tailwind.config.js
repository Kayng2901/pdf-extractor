/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  shake: {
			'0%, 100%': { transform: 'translateX(0)' },
			'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
			'20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
		  },
		  fadeIn: {
			'0%': { opacity: '0', transform: 'translateY(10px)' },
			'100%': { opacity: '1', transform: 'translateY(0)' },
		  },
		  float1: {
			'0%, 100%': { transform: 'translate(0, 0)' },
			'50%': { transform: 'translate(20px, -20px)' },
		  },
		  float2: {
			'0%, 100%': { transform: 'translate(0, 0)' },
			'50%': { transform: 'translate(-20px, 20px)' },
		  },
		  float3: {
			'0%, 100%': { transform: 'translate(0, 0)' },
			'50%': { transform: 'translate(15px, 15px)' },
		  },
		  float4: {
			'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
			'50%': { transform: 'translate(-15px, 15px) rotate(90deg)' },
		  },
		  float5: {
			'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
			'50%': { transform: 'translate(15px, -15px) rotate(-90deg)' },
		  },
		  expandCard: {
			'0%': { height: 'var(--height-from)', opacity: 0 },
			'100%': { height: 'var(--height-to)', opacity: 1 },
		  }
		},
		animation: {
		  shake: 'shake 0.5s ease-in-out',
		  fadeIn: 'fadeIn 0.5s ease-out',
		  float1: 'float1 10s ease-in-out infinite',
		  float2: 'float2 12s ease-in-out infinite',
		  float3: 'float3 14s ease-in-out infinite',
		  float4: 'float4 8s ease-in-out infinite',
		  float5: 'float5 11s ease-in-out infinite',
		  expandCard: 'expandCard 0.3s ease-out forwards',
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }