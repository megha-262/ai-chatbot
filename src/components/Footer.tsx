import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <a className="text-2xl font-bold">Health AI</a>
            </Link>
            <p className="text-gray-400 text-base">
              Your trusted partner in health and wellness.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/health-diary">
                      <a className="text-base text-gray-300 hover:text-white">Health Diary</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/medicine-reminder">
                      <a className="text-base text-gray-300 hover:text-white">Medicine Reminder</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/emergency">
                      <a className="text-base text-gray-300 hover:text-white">Emergency</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/contact">
                      <a className="text-base text-gray-300 hover:text-white">Contact</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy">
                      <a className="text-base text-gray-300 hover:text-white">Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <a className="text-base text-gray-300 hover:text-white">Terms of Service</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about">
                      <a className="text-base text-gray-300 hover:text-white">About</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} Health AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;