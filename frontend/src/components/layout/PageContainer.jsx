import { motion } from 'framer-motion';

export function PageContainer({ children, title }) {
    const pageVariants = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }
    };

    return (
        <motion.main 
            className="flex-grow pt-20 pb-12"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {title && (
                   <div className="mb-6">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                             {title}
                        </h1>
                   </div>
                )}
                {children}
            </div>
        </motion.main>
    );
}
