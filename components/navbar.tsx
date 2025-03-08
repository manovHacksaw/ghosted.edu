"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Ghost, Menu, X, ChevronDown, UserCircle, LogIn, LogOut } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { motion } from "framer-motion"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import Cookies from "js-cookie"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { ocAuth, authState } = useOCAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    
    window.addEventListener("scroll", handleScroll)
    document.addEventListener("click", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Remove from localStorage & sessionStorage
      localStorage.removeItem("oc-token-storage");
      sessionStorage.clear();
  
      // Remove cookies
      Cookies.remove("oc-token-storage");
      Cookies.remove("oc-session"); // Remove any other auth-related cookies
  
      // Force reload to clear any in-memory auth state
      window.location.reload(); 
  
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          scrolled 
            ? "bg-gray-900/90 backdrop-blur-md shadow-lg" 
            : "bg-transparent backdrop-blur-sm"
        } border-b ${scrolled ? "border-white/10" : "border-transparent"}`}
      >
        <Link href="/" className="flex items-center space-x-2 group">
          <Ghost className="w-8 h-8 text-[#00EDBE] transition-transform duration-300 group-hover:rotate-6" />
          <span className="text-white font-medium text-xl">
            Ghosted
            <span className="text-[#00EDBE] font-bold">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLinkWithDropdown 
            name="explore"
            mainLink={{ href: "/explore", label: "Explore Careers" }}
            isActive={activeDropdown === "explore"}
            onClick={toggleDropdown}
            dropdownItems={[
              { href: "/explore/tech", label: "Technology" },
              { href: "/explore/business", label: "Business" },
              { href: "/explore/creative", label: "Creative" },
              { href: "/explore/all", label: "View All Fields" }
            ]}
          />
          
          <NavLinkWithDropdown 
            name="skills"
            mainLink={{ href: "/skills", label: "Skill Analysis" }}
            isActive={activeDropdown === "skills"}
            onClick={toggleDropdown}
            dropdownItems={[
              { href: "/skills/assessment", label: "Take Assessment" },
              { href: "/skills/recommendations", label: "Get Recommendations" },
              { href: "/skills/roadmap", label: "Your Skill Roadmap" }
            ]}
          />
          
          <NavLink href="/jobs">Internships</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {!authState?.isAuthenticated ? (
            <Button onClick={handleLogin} variant="ghost" className="text-white hover:text-[#00EDBE] hover:bg-white/5 transition-all">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-white">{authState?.OCId}</span>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-[#00EDBE] hover:bg-white/5 transition-all">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-white hover:bg-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </motion.nav>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-md transition-all duration-300 flex flex-col pt-20 px-6 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-6 py-8">
          <MobileNavLink href="/explore" onClick={() => setIsOpen(false)}>Explore Careers</MobileNavLink>
          <MobileNavLink href="/skills" onClick={() => setIsOpen(false)}>Skill Analysis</MobileNavLink>
          <MobileNavLink href="/internships" onClick={() => setIsOpen(false)}>Internships</MobileNavLink>
          <MobileNavLink href="/pricing" onClick={() => setIsOpen(false)}>Pricing</MobileNavLink>
        </div>
        
        <div className="mt-auto border-t border-white/10 pt-6 pb-8 space-y-4">
          {!authState?.isAuthenticated ? (
            <>
              <Button onClick={handleLogin} variant="outline" className="w-full justify-start text-white border-white/20 hover:text-[#00EDBE] hover:border-[#00EDBE]">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button className="w-full justify-start bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">
                <UserCircle className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </>
          ) : (
            <>
              <div className="text-white px-2 py-2 border-b border-white/10">
                Signed in as: {authState?.OCId}
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-white border-white/20 hover:text-[#00EDBE] hover:border-[#00EDBE]">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group py-2">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00EDBE] transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function NavLinkWithDropdown({ 
  name,
  mainLink, 
  dropdownItems, 
  isActive,
  onClick
}: { 
  name: string;
  mainLink: { href: string; label: string };
  dropdownItems: Array<{ href: string; label: string }>;
  isActive: boolean;
  onClick: (e: React.MouseEvent, name: string) => void;
}) {
  return (
    <div className="relative group">
      <div 
        className="flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer py-2"
        onClick={(e) => onClick(e, name)}
      >
        {mainLink.label}
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00EDBE] transition-all duration-300 group-hover:w-full" />
      </div>
      
      {isActive && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-2 w-48 z-50 overflow-hidden">
          <Link href={mainLink.href} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#141BEB]/20 hover:text-white">
            All {mainLink.label}
          </Link>
          
          <div className="h-px bg-white/10 my-1"></div>
          
          {dropdownItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#141BEB]/20 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileNavLink({ 
  href, 
  children, 
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link 
      href={href} 
      className="block text-xl font-medium text-white py-2 border-b border-white/10 hover:text-[#00EDBE] transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}