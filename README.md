# ExpressNotes

ExpressNotes is a modern, user-friendly note-taking application that allows you to create, edit, and manage your notes with a clean and intuitive interface.

## Features

- Create and edit notes with titles and content
- View all your notes in a responsive grid layout
- Delete notes with confirmation
- Dark mode support
- Responsive design for all devices
- Data persistence using local storage

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture Decisions

### Component Structure

- **Component-Based Architecture**: The application is built using React's component-based architecture, enabling modularity, reusability, and maintainability of UI elements.
- **Separation of Concerns**: Components are organized by functionality (e.g., `add-note-form.tsx`, `notes-list.tsx`) to ensure each component has a single responsibility.
- **Common UI Elements**: Reusable UI elements are separated into a `ui` directory, providing a consistent design language throughout the application.
- **"Use Client" Directive**: Components that require client-side interactivity are explicitly marked with the "use client" directive for Next.js RSC compatibility.

### Storage Strategy

- **Why LocalStorage**: LocalStorage was chosen as the data storage solution for several reasons:

  - Simplicity: No need for backend setup or database configuration
  - Offline capability: The app works without an internet connection
  - Zero latency: Instant data access without network requests
  - User privacy: Data stays on the user's device
  - Reduced complexity: No authentication or API management required

- **Storage Service Layer**: A dedicated storage module (`storage.js`) abstracts the storage implementation, making it easier to swap out for server-based storage in the future.

### Component Design

- **Controlled Components**: Form inputs use controlled components to maintain a single source of truth for data.
- **Error Handling**: Comprehensive error handling with user-friendly notifications via toast messages.
- **Loading States**: Visual feedback for asynchronous operations to improve perceived performance.
- **Progressive Enhancement**: The UI is designed to work with or without JavaScript, though full functionality requires JS.

### Navigation

- **Minimalist Navigation**: Simple horizontal navigation that focuses user attention on content rather than UI elements.
- **Mobile-First Approach**: Responsive design with a hamburger menu for mobile devices.
- **Context-Aware Actions**: Navigation options are context-sensitive, showing relevant actions based on the current view.

### State Management

- **Context API**: React's Context API is used for global state management, avoiding prop drilling and reducing complexity.
- **Custom Hooks**: Custom hooks like `useNotes` encapsulate state management logic and provide a clean API for components.
- **Optimistic Updates**: UI updates are performed optimistically before storage operations complete, improving perceived performance.

### Styling

- **Why Tailwind CSS**: Tailwind CSS was chosen for styling for several key reasons:

  - Utility-first approach enables rapid UI development without leaving HTML
  - Consistent design system with pre-defined spacing, colors, and typography
  - Built-in responsive design utilities simplify mobile-first development
  - Smaller bundle size through PurgeCSS optimization
  - Component composition through utility classes instead of custom CSS

- **Component Library Integration**: UI components from shadcn/ui provide accessible, customizable building blocks that integrate well with Tailwind.
- **Dark Mode Support**: Theme switching with system preference detection for improved user experience.
- **CSS Variables**: Custom properties for design tokens provide consistency and theme support.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
