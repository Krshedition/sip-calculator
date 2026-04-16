export function Footer() {
    return (
        <footer className="bg-white dark:bg-dark-bg border-t border-slate-200 dark:border-dark-border mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start space-x-6 md:order-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Educational Purpose Only. Not Financial Advice.
                        </span>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center md:text-left text-sm text-slate-500 dark:text-slate-400">
                            &copy; {new Date().getFullYear()} SIP Wealth Calculator. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
