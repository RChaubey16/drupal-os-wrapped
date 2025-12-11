import React, { useState, useRef } from 'react';
import { THEMES } from './constants';
import { ThemeType, ThemeContextType, UserYearData } from './types';
import { fetchIssuesWithCommentsByUsername, fetchUserByUsername } from './api/drupal';
import { transformDrupalData } from './utils/transformers';

import Hero from './components/sections/Hero';
import TopProject from './components/sections/TopProject';
import Timeline from './components/sections/Timeline';
import IssueGrid from './components/sections/IssueGrid';
import ShareFooter from './components/sections/ShareFooter';
import UsernameForm from './components/sections/UsernameForm';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('muted');
  const [reduceMotion, setReduceMotion] = useState(false);
  
  // Data State
  const [userData, setUserData] = useState<UserYearData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<string | undefined>(undefined);

  const contentRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setTheme(prev => prev === 'bright' ? 'muted' : 'bright');
  const toggleReduceMotion = () => setReduceMotion(prev => !prev);

  const themeStyles = THEMES[theme];

  const themeContext: ThemeContextType = {
    theme,
    toggleTheme,
    reduceMotion,
    toggleReduceMotion
  };

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    setLoadingAvatar(undefined);
    
    try {
      // 1. Fetch user first to show avatar in game
      try {
        const userPreview = await fetchUserByUsername(username);
        setLoadingAvatar(userPreview.picture?.url);
      } catch (e) {
        // If basic user fetch fails, main fetch will likely fail too, but let's continue
        console.warn("Could not pre-fetch user for avatar", e);
      }

      // 2. Main data fetch
      const apiResponse = await fetchIssuesWithCommentsByUsername(username, 2025);
      
      if (apiResponse.totalCount === 0 && !apiResponse.topProject) {
         // Could set a specific message if no activity found
      }
      
      const transformedData = transformDrupalData(apiResponse);
      setUserData(transformedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch user data. Please check the username and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = () => {
    contentRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const handleReset = () => {
    setUserData(null);
    setError(null);
    setLoadingAvatar(undefined);
  };

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      <div className={`min-h-screen w-full selection:bg-pink-500 selection:text-white ${themeStyles.bg}`}>
        
        {/* Header / Brand */}
        <header className="fixed top-0 left-0 w-full p-4 z-50 pointer-events-none">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
             <div 
               onClick={handleReset}
               className={`font-bold text-xl tracking-tighter mix-blend-difference opacity-80 cursor-pointer pointer-events-auto ${theme === 'muted' ? 'text-white' : 'text-black'}`}
             >
               DrupalOS Wrapped
             </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!userData ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UsernameForm 
                  onSearch={handleSearch} 
                  loading={loading} 
                  error={error} 
                  themeStyles={themeStyles} 
                  userAvatarUrl={loadingAvatar}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Hero 
                  data={userData} 
                  themeStyles={themeStyles} 
                  onExplore={handleExplore}
                />
                
                <div ref={contentRef}>
                  <TopProject 
                    data={userData} 
                    themeStyles={themeStyles} 
                  />
                  
                  <Timeline 
                    data={userData} 
                    themeStyles={themeStyles} 
                    isDark={theme === 'muted'}
                  />
                  
                  <IssueGrid 
                    data={userData} 
                    themeStyles={themeStyles} 
                  />
                </div>

                <ShareFooter 
                  data={userData} 
                  themeContext={themeContext}
                  themeStyles={themeStyles}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </MotionConfig>
  );
};

export default App;
