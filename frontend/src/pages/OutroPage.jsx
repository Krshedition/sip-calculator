import { motion } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer';

export function OutroPage() {
  const teamMembers = [
    { name: 'Krish Bhutiya', role: 'Developer' },
    { name: 'Isha Lodhi', role: 'Developer' },
    { name: 'Harshvardan Choudhary', role: 'Developer' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-16"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300">
              Meet the Team
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              The minds behind SIP Wealth, dedicated to bringing you the best financial tools and simulators.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-dark-border pb-4 inline-block">
              Created By
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-primary-100 to-primary-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center mb-4 text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 pt-16 border-t border-slate-200 dark:border-dark-border relative isolate">
            {/* Background elements for guidance section highlight */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-100/50 via-transparent to-transparent dark:from-primary-900/10 opacity-70"></div>
            
            <p className="text-sm uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 mb-6">
              Under the Guidance of
            </p>
            <div className="inline-flex flex-col items-center justify-center p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden backdrop-blur-sm">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-2xl"></div>
              
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-primary-600 p-1 mb-6 relative z-10 shadow-lg shadow-primary-500/20">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-primary-600 dark:from-blue-400 dark:to-primary-400">
                  RS
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10 mb-2">
                Dr. Rahul Kumar Sharma
              </h2>
              <p className="text-primary-600 dark:text-primary-400 font-medium tracking-wide relative z-10">
                Project Guide & Mentor
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </PageContainer>
  );
}
