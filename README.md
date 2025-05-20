# ⚛️ Next.js App – Atomic Design, TypeScript & Tailwind CSS

This is a modern web application built with [Next.js 13+ App Router](https://nextjs.org/docs/app), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/), following the **Atomic Design** pattern for component architecture.

---

## 🧱 Project Structure
/app → App Router pages and layouts
/components → Atomic components (atoms, molecules, organisms, etc.)
/public → Static assets (e.g., images, favicon)
/styles → Tailwind and global CSS
## Getting Started
### 1. **Clone the Repository**

```bash
git clone https://github.com/Apartey/apartey-frontend.git
cd apartey-frontend
first,  Install Dependencies
Make sure you have Node.js (v18 or later) installed.
```bash
npm install

Now, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This project follows the Atomic Design methodology:

/components
  /atoms        → Basic UI elements (Button, Input, Icon)

  /molecules    → Groups of atoms (FormField, CardHeader)

  /organisms    → Sections made of molecules (Navbar, Footer)
  
  /templates    → Page-level layouts