<h1 align="center">SEA Catering Website</h1>
<p align="center">
    <img alt="SEA Salon Website" src="https://res.cloudinary.com/dsw1iot8d/image/upload/v1751073537/Screenshot_2025-06-28_081839_jyszfo.png">
</p>

<p align="center">
 Built with Next.js and Supabase
</p>

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#running-the-project-locally"><strong>Running the Project Locally</strong></a> ·
</p>

## Tech Stack

This project is built using the following technologies:

- **Frontend Framework**: [Next.js](https://nextjs.org) - A React framework for hybrid static & server rendering.
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework for rapidly building custom designs.
- **Database & Auth**: [Supabase](https://supabase.com) - An open-source Firebase alternative providing databases, authentication, and more.
- **Deployment**: [Vercel](https://vercel.com) - A platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) - A cloud-based media management platform that enables efficient image and video uploads, transformations, optimizations, and delivery via a global CDN.

## Features

- Navbar
- Page Routing
- Testimonial System
- Subscription System
- Authentication System of User and Admin
- User and Admin Dashboard

## Running the Project Locally

To run this project on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Torikh42/sea-catering
```

2. Navigate to the project directory:

```bash
cd sea-catering
```

3. Install Dependencies

```bash
npm install
```

4. Set Up Environment Variables

This project uses environment variables to connect to your Supabase project.

a. Rename the example file:

Rename `.env.example` to `.env` in the root of your project

b. Find your Supabase keys:

Go to your Supabase project dashboard.

- Navigate to Project Settings -> Data API and API Keys.
- You will find your Project URL and Project API Keys.

c. Find your Database Connection String:

Navigate to your Project and click the top connect button. in the connection string tab, scroll down and copy your session pooler key. Make sure to replace [YOUR-PASSWORD] with your actual database password when you first create the supabase project.

d. Update the `.env` file:

Open the newly renamed `.env` file and replace the placeholder values with your actual keys from Supabase. It should look like this:

```
# Supabase Project URL and Anon Key
NEXT_PUBLIC_SUPABASE_URL=[Your Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"

# Supabase Service Role Key (for server-side operations, e.g., middleware)
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"

# Your site's URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# This is for ORM/Drizzle/Prisma
DATABASE_URL=[Your Database Connection String].
You can find it in your project by click the connect button in the top and scroll down to session pooler. change the [YOUR-PASSWORD] with your password when you first time create the supabase project
```

5. Set up the Database Schema

If you are setting up a new Supabase project, you need to apply the database schema. This project uses Prisma for schema management.

a. Push the schema to your database:
Run the Prisma command to sync your schema with the database.

```bash
npm run migrate
```

This command is a shortcut for `npx prisma generate` && `npx prisma migrate dev. It will apply any new changes from your schema.prisma to the database.

b. Run seed script:
If you need to populate your database with initial data, run the seed script:

```bash
npx prisma db seed
```

<img alt="SEA Salon Website" src="https://res.cloudinary.com/dsw1iot8d/image/upload/v1751072447/Screenshot_2025-06-28_075939_kuuxlx.png">

6. Run the Development Server
   Once all dependencies and environment variables are set up, you can start the Next.js development server:

```bash
npx run dev
```

The site should now be running on [localhost:3000](http://localhost:3000/).

7. how to make an admin account

When a user first signs up, their account is automatically created with a user role. To grant a user admin privileges, you need to update their metadata

To update the role, follow these steps:

a. Go to your Supabase Dashboard and navigate to the `SQL Editor`.

b. Execute the following SQL query

```bash
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE id = '{your account id}';
```

**Remember to replace `{your account id}` with the actual UUID of the user account you want to promote.** You can find the user's ID in the `Authentication` tab of your Supabase Dashboard.

# n8n Integration (Automatic Email Notifications)
This project uses n8n to send a confirmation email when a user successfully subscribes.

## Workflow
- Trigger: The src/action/subscription.ts file in Next.js sends a fetch request (POST) to an n8n Webhook URL.
- Action: n8n receives data (email, name, package details) via the Webhook node.
- Result: The data is forwarded to the Gmail node (or another email node), which then sends a confirmation email to the user.
## Settings
- Create Workflow: In n8n, create a Webhook -> Gmail workflow.
- Get URL: Copy the Production URL from your Webhook node.
- Set Environment Variable: Add the URL to your .env/.env.local file.

## n8n Webhook for subscription confirmation
```bash
N8N_SUBSCRIPTION_WEBHOOK_URL="[YOUR_N8N_PRODUCTION_WEBHOOK_URL]"
```
## IMPORTANT FOR DEPLOYMENT (VERCEL):

- Your n8n instance must have a public URL (cannot be localhost).
- Add N8N_SUBSCRIPTION_WEBHOOK_URL as an Environment Variable in your Vercel dashboard.
