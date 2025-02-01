# Iskonek

Iskonek is an anonymous chat application specifically designed for PUP (Polytechnic University of the Philippines) students to connect with fellow students in a safe and secure environment.

## Features

- **Anonymous Chat**: Connect and chat with other PUP students without revealing your identity
- **Blitz Chat**: Quick chat sessions with time restrictions for spontaneous conversations
- **Friend System**: Add friends and manage connections while maintaining anonymity
- **Profile Customization**: Customize your avatar and profile settings
- **Real-time Messaging**: Instant message delivery with typing indicators
- **Conversation Starters**: Built-in conversation prompts to help break the ice
- **PUP Email Verification**: Exclusive access for verified PUP students

## Tech Stack

- Frontend: Next.js 15.0, React 19, TypeScript
- Styling: Tailwind CSS, Radix UI Components
- Backend: Supabase (Authentication, Database, Real-time subscriptions)
- AI Integration: OpenAI for content moderation
- Avatars: DiceBear for generating unique user avatars

## Getting Started

1. Clone the repository

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Set up environment variables: Create a `.env.local` file with the following:

    ```text
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
    ```

4. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development

The project structure follows Next.js 13+ App Router conventions:

- `app`: Page routes and API endpoints
- `components`: Reusable React components
- `hooks`: Custom React hooks
- `utils`: Utility functions and helpers
- `lib`: Shared libraries and configurations

## Authentication

The application uses Supabase Authentication with:

- PUP email verification
- Password reset functionality
- Session management
- Protected routes

## Features in Detail

### Chat System

- Random matching with other online users
- Timed chat sessions (Blitz mode)
- Friend-to-friend direct messaging
- Real-time message delivery
- Content moderation using OpenAI

### Profile Management

- Customizable avatars
- Department selection
- Username customization
- Profile color themes
- Account security settings
