'use client'

import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { Ghost } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RedirectPage() {
  const {authState} = useOCAuth();
  console.log("AUTH STATE IN REDIRECT:", authState?.OCId)
  const router = useRouter();

  useEffect(() => {
    if (authState?.OCId) {
      fetch("/api/user", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ OCId: authState.OCId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.isFirstTimeLogin) {
            router.push('/onboarding');
          } else {
            router.push('/');
          }
        })
        .catch(err => {
          console.error('Error checking user status:', err);
          router.push('/');
        });
    }
  }, [authState?.OCId, router]);

  const loginSuccess = () => {
    router.push('/'); 

    
    

  };

  const loginError = (error:any) => {
    console.error('Login error:', error);
  };

  function CustomErrorComponent() {
    const { authState } = useOCAuth();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="bg-black bg-opacity-60 p-8 rounded-xl backdrop-blur-md border border-red-800 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <Ghost className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-500 text-center">Ghosted by the Login Server</h2>
          <p className="text-center mb-4">Error Logging in: {authState.error?.message}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/login')}
              className="mt-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CustomLoadingComponent() {
    const [dots, setDots] = useState('.');
    const [progress, setProgress] = useState(0);
    const [particleCount] = useState(15);
    const [messageIndex, setMessageIndex] = useState(0);
    const particles = Array(particleCount).fill(0);
    
    // Ghost-themed loading messages
    const loadingMessages = [
      "Conjuring digital pixie dust...",
      "Brewing the perfect login potion...",
      "Making sure no ghosts are in the machine...",
      "Poltergeist prevention in progress...",
      "Checking your spiritual connection...",
      "Un-ghosting your digital presence...",
      "Summoning your user credentials from the beyond...",
      "Exorcising any unauthorized entities...",
      "Making the login spirits happy...",
      "Manifesting your digital identity...",
      "Performing ghost protocol authentication...",
      "Spooking away any cyber threats..."
    ];

    useEffect(() => {
      // Animated dots
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length < 3 ? prev + '.' : '.');
      }, 400);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15;
          return prev < 90 ? prev + increment : prev;
        });
      }, 500);
      
      // Rotating messages
      const messageInterval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
      
      return () => {
        clearInterval(dotsInterval);
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }, [loadingMessages.length]);
    
    return (
      <div className="min-h-screen w-full overflow-hidden relative flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#050824] to-[#090E4A]">
        {/* Ghost-shaped floating particles instead of circles */}
        {particles.map((_, index) => (
          <div
            key={index}
            className="absolute opacity-10 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`,
            }}
          >
            <Ghost 
              size={Math.random() * 20 + 10} 
              className="text-white opacity-10" 
            />
          </div>
        ))}
        
        {/* Subtle glow behind main content */}
        <div className="absolute w-96 h-96 bg-[#00EDBE] rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        
        {/* Main content card */}
        <div className="relative z-10 bg-black bg-opacity-60 backdrop-blur-lg p-8 rounded-2xl border border-[#00EDBE]/20 shadow-2xl max-w-xl w-full mx-4 group hover:border-[#00EDBE]/40 transition-all duration-500">
          {/* Animated Ghost Icon */}
          <div className="flex justify-center mb-6 relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#0A0F4A] to-[#00EDBE]/40 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                <Ghost 
                  className="w-16 h-16 text-[#00EDBE] animate-bounce-slow absolute" 
                />
                
                {/* Multiple smaller ghosts rotating around */}
                <div className="w-full h-full absolute animate-spin-slow">
                  <Ghost className="w-8 h-8 text-[#00EDBE]/30 absolute -top-2 left-1/2 transform -translate-x-1/2" />
                  <Ghost className="w-6 h-6 text-[#00EDBE]/30 absolute top-1/2 -right-2 transform -translate-y-1/2" />
                  <Ghost className="w-7 h-7 text-[#00EDBE]/30 absolute -bottom-2 left-1/2 transform -translate-x-1/2" />
                  <Ghost className="w-5 h-5 text-[#00EDBE]/30 absolute top-1/2 -left-2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="font-bold text-2xl mb-3 text-white text-center">
            We won't ghost you! Authenticating{dots}
          </h1>
          
          <p className="italic text-white/60 text-sm mb-6 text-center">
            (Ghosted is connecting to your Open Campus ID)
          </p>
          
          {/* Progress bar with ghost-styled indicator */}
          <div className="w-full bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#00EDBE]/90 to-[#141BEB]/70 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute -right-3 -top-1 transform scale-75">
                <Ghost className="w-6 h-6 text-[#00EDBE]" />
              </div>
              <div className="h-full w-12 absolute right-0 bg-white/10 blur-sm"></div>
            </div>
          </div>
          
          {/* Animated messages */}
          <div className="text-sm text-gray-400 text-center h-6 mb-4 transition-opacity duration-300">
            {loadingMessages[messageIndex]}
          </div>
          
          {/* Percentage counter with ghost icon */}
          <div className="text-center text-[#00EDBE] font-mono font-bold flex items-center justify-center gap-2">
           
            <span>{Math.min(Math.floor(progress), 99)}%</span>
           
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-6 text-center text-gray-600 text-xs">
          <p>© {new Date().getFullYear()} Ghosted by OpenCampus • Secure Authentication</p>
        </div>
      </div>
    );
  }

  return (
    <LoginCallBack
      errorCallback={loginError}
      successCallback={loginSuccess}
      customErrorComponent={<CustomErrorComponent />}
      customLoadingComponent={<CustomLoadingComponent />}
    />
  );
}