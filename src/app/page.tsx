import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to Event Management
      </h1>
      <ThemeToggle />
    </div>
  );
}
