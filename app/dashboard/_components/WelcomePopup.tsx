"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Rocket, MessageSquare, Ghost, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 40000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 shadow-xl shadow-blue-500/10">
        <div className="text-center space-y-4 py-2">
          <div className="flex justify-center items-center space-x-2 text-3xl animate-pulse">
            <span>✨</span>
            <span className="font-bold bg-gradient-to-r from-[#141BEB] to-[#00EDBE] text-transparent bg-clip-text">
              Congratulations!
            </span>
            <span>✨</span>
          </div>
          
          <p className="text-lg text-gray-200 font-medium">
            Onboarding complete! <Rocket className="inline-block h-5 w-5 text-[#00EDBE] ml-1" />
          </p>

          <div className="space-y-2 bg-white/5 rounded-lg p-4 border border-[#00EDBE]/20">
            <div className="flex items-center gap-2 text-[#00EDBE]">
              <CheckCircle className="h-5 w-5" />
              <span>AI-powered career insights ready</span>
            </div>
            <div className="flex items-center gap-2 text-[#00EDBE]">
              <CheckCircle className="h-5 w-5" />
              <span>Smart job tracking & skill recommendations set</span>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-center">
              <span className="mr-2">What's next?</span>
              <Sparkles className="h-5 w-5 text-[#00EDBE]" />
            </h3>
            <p className="text-gray-300 font-medium">Join our blockchain network! 🔗</p>
            <p className="text-gray-300 mt-2 text-sm">
              <MessageSquare className="inline-block h-4 w-4 text-[#00EDBE] mr-1" />
              Connect with job seekers and recruiters for transparent and accountable hiring opportunities.
            </p>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-[#141BEB] to-[#00EDBE] hover:opacity-90 transition-opacity text-white font-medium"
            onClick={() =>  router.push("/onboarding/web3")}
          >
            <Ghost className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}