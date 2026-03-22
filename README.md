# LibraryFlow - Book Management System

A modern, fast, and secure library management application built with React, TypeScript, and Vite.

## 🚀 Key Features

- **Admin Dashboard**: Comprehensive management interface for books and inventory.
- **System Logs**: Audit trail and application activity monitoring with integrated pagination.
- **Reusable Data Tables**: Generic `DataTable` component for consistent UI and reduced boilerplate across the application.
- **Book Management**: Create, update, and delete books with a refined workflow.
- **Debounced Search**: Optimized search functionality for better performance.
- **Role-Based Access**: Secured routes and actions for administrators.
- **Modern UI**: Built with Tailwind CSS and Lucide icons for a premium feel.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **state Management**: Redux Toolkit
- **Styling**: Tailwind CSS, PostCSS
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library

## 📂 Project Structure

- `src/components/ui`: Reusable UI components (Buttons, Modals, Tables, etc.)
- `src/pages/admin`: Admin-specific views (Dashboard, Logs)
- `src/store`: Redux slices and store configuration
- `src/hooks`: Custom React hooks for data fetching and actions
- `src/schemas`: Zod validation schemas

## 🏗️ Reusable Components

### DataTable
The `@/components/ui/DataTable` is a powerful, generic component for displaying tabular data. It handles:
- **Columns**: Definable headers and custom cell rendering.
- **Loading States**: Built-in support for loading indicators.
- **Empty States**: Configurable messages for empty data.
- **Pagination**: Integrated pagination UI with customizable callbacks.

## 🚦 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your `.env` file with the API URL.
4. Run the development server: `npm run dev`.
5. Run tests: `npm run test`.
