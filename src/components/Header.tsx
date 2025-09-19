import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-gray-900 dark:text-white">Health AI</a>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/health-diary">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Health Diary</a>
              </Link>
              <Link href="/medicine-reminder">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Medicine Reminder</a>
              </Link>
              <Link href="/emergency">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Emergency</a>
              </Link>
              <Link href="/login">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>
              </Link>
              <Link href="/signup">
                <a className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;