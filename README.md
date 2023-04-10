# Code Crafters
Code Crafters is a web platform that provides challenges for users who want to practice their skills in various technologies, including frontend, backend, machine learning, mobile, blockchain, and more. Users can submit their solutions using any technology they like and browse the solutions of others, liking and commenting on them.


## Stack Used
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Getting Started
To get started with this project, you will need to have Node.js and npm installed on your machine.
1. Clone the repository:
```bash
git clone https://github.com/YaSh8202/code-crafters.git
```
2. Navigate to the project directory:
```bash
 cd code-crafters
```
3. Install the dependencies:
```bash
  npm install
```
4. Go to Supabase and create a new project and get the database url.
5. Create a new oauth app on github and add the callback url as `http://localhost:3000/api/auth/callback/github`.
6. Now create a `.env` file in the root directory and add the variables as shown in `.env.example`.
7. Now run the development server:
```bash
  npm run dev
```

## ERD
![](https://raw.githubusercontent.com/yash8202/code-crafters/main/prisma/ERD.svg)
