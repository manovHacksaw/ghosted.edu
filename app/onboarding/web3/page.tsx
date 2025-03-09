"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Database,
  Shield,
  Award,
  Eye,
  FileCheck,
  Sparkles,
  Rocket,
  GraduationCap,
  BookOpen,
  Coins,
  Lock,
  Info,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  XCircle
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import abi from "@/lib/abi"
import { CONTRACT_ADDRESS } from "@/lib/constants"
import { useOCAuth } from "@opencampus/ocid-connect-js"

// EDU Chain testnet configuration
const EDU_CHAIN_CONFIG = {
  chainId: "0xa045c", // 656476 in hex
  chainName: "EDU Chain Testnet",
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18
  },
  rpcUrls: ["wss://open-campus-codex-sepolia.drpc.org"],
  blockExplorerUrls: ["https://testnet.etherscan.io/"]
}

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    shareName: false,
    shareEmail: false,
    userType: "0", // Default to Applicant (0)
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")
  const [eduInfo, setEduInfo] = useState(false)
  const [networkStatus, setNetworkStatus] = useState({
    isCorrectNetwork: false,
    checking: true
  })
  const [walletMatchesOCID, setWalletMatchesOCID] = useState(false)

  const { ocAuth, authState } = useOCAuth();
  
  // Check wallet connection and network on component mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  // Check if wallet address matches OCID address whenever either changes
  useEffect(() => {
    if (account && authState.ethAddress) {
      const matches = account.toLowerCase() === authState.ethAddress.toLowerCase()
      setWalletMatchesOCID(matches)
    } else {
      setWalletMatchesOCID(false)
    }
  }, [account, authState?.ethAddress])

  const checkWalletConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setWalletConnected(true)
          setAccount(accounts[0])
          checkNetwork()
        } else {
          setNetworkStatus({ isCorrectNetwork: false, checking: false })
        }
      } else {
        setNetworkStatus({ isCorrectNetwork: false, checking: false })
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
      setNetworkStatus({ isCorrectNetwork: false, checking: false })
    }
  }

  const checkNetwork = async () => {
    try {
      setNetworkStatus({ ...networkStatus, checking: true })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const isCorrect = chainId === EDU_CHAIN_CONFIG.chainId
      setNetworkStatus({ isCorrectNetwork: isCorrect, checking: false })
      return isCorrect
    } catch (error) {
      console.error("Error checking network:", error)
      setNetworkStatus({ isCorrectNetwork: false, checking: false })
      return false
    }
  }

  const switchNetwork = async () => {
    try {
      setNetworkStatus({ ...networkStatus, checking: true })
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [EDU_CHAIN_CONFIG]
      })
      await checkNetwork()
    } catch (error) {
      console.error("Error switching network:", error)
      setError("Failed to switch to EDU Chain network. Please try manually.")
      setNetworkStatus({ isCorrectNetwork: false, checking: false })
    }
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletConnected(true)
        setAccount(accounts[0])
        await checkNetwork()
      } else {
        setError("Please install MetaMask to connect to EDU Chain")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const toggleEduInfo = () => {
    setEduInfo(!eduInfo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setTxHash("")

    try {
      if (!window.ethereum) throw new Error("No crypto wallet found. Please install MetaMask.")
      
      if (!authState.ethAddress) throw new Error("Please connect your OCID first.")

      // Verify we're on the correct network
      const isCorrectNetwork = await checkNetwork()
      if (!isCorrectNetwork) {
        throw new Error("Please switch to EDU Chain testnet before proceeding.")
      }

      // Verify wallet matches OCID
      if (!walletMatchesOCID) {
        throw new Error("Connected wallet does not match your OCID wallet. Please connect the correct wallet.")
      }

      // Connect to the provider
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Create contract instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

      // Call the onboardUser function
      const tx = await contract.onboardUser(
        formData.name,
        formData.email,
        formData.message,
        formData.shareEmail,
        formData.shareName,
        Number.parseInt(formData.userType), // Convert string to number for enum
        authState.ethAddress // Use OCID address for signing
      )

      // Wait for transaction to be mined
      setTxHash(tx.hash)
      await tx.wait()

      console.log("Successfully onboarded to EDU Chain:", tx.hash)
      alert("Successfully onboarded to EDU Chain! You've earned 100 EDU tokens.")
    } catch (error) {
      console.error("Error connecting to EDU Chain:", error)
      setError(error.message || "Failed to connect to EDU Chain. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const features = [
    {
      icon: <Database className="h-6 w-6 text-[#00EDBE]" />,
      title: "On-Chain Tracking",
      description:
        "Every job application interaction is recorded on EDU Chain testnet, preventing ghosting and ensuring accountability.",
    },
    {
      icon: <Shield className="h-6 w-6 text-[#00EDBE]" />,
      title: "Decentralized Identity",
      description:
        "Control your career data with EDU Chain DID technology while maintaining full privacy and ownership.",
    },
    {
      icon: <Award className="h-6 w-6 text-[#00EDBE]" />,
      title: "Reputation System",
      description: "Recruiters build on-chain reputation scores based on their engagement and reliability.",
    },
    {
      icon: <Eye className="h-6 w-6 text-[#00EDBE]" />,
      title: "Profile Tracking",
      description: "Monitor who views your NFT-based resume while keeping your credentials verifiable.",
    },
    {
      icon: <FileCheck className="h-6 w-6 text-[#00EDBE]" />,
      title: "Verified Certifications",
      description: "EDU Chain-verified skill certifications eliminate fraud and boost your credibility.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#00EDBE]" />,
      title: "Incentive Rewards",
      description: "Earn EDU tokens for upskilling and applying to verified jobs in our incentive-driven ecosystem.",
    },
  ]

  const eduChainBenefits = [
    {
      icon: <GraduationCap className="h-5 w-5" />,
      title: "Verifiable Credentials",
      description: "Certificates issued as NFTs",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Learn-to-Earn",
      description: "Rewards for skill development",
    },
    {
      icon: <Coins className="h-5 w-5" />,
      title: "EDU Tokens",
      description: "Earn through participation",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Data Privacy",
      description: "You control your data",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* EDU Chain Banner */}
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 py-1.5 px-4 border-[#00EDBE]/30 text-[#00EDBE]">
            Powered by EDU Chain Testnet
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#141BEB] to-[#00EDBE] text-transparent bg-clip-text">
            Welcome to the Future of Career Verification
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join our decentralized platform where your credentials, applications, and career progress are securely
            stored on EDU Chain, creating a transparent and accountable hiring ecosystem.
          </p>

          {/* EDU Chain Benefits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {eduChainBenefits.map((benefit, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-[#00EDBE] mb-2">{benefit.icon}</div>
                <h3 className="font-medium text-white">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Features Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Rocket className="mr-2 h-6 w-6 text-[#00EDBE]" />
              Features & Benefits
            </h2>

            <div className="grid grid-cols-1 gap-5">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 border border-white/10 hover:border-[#00EDBE]/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-bold text-[#00EDBE]">{feature.title}</h3>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div>
            <Card className="bg-white/5 border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-[#141BEB] to-[#00EDBE] text-transparent bg-clip-text">
                  Connect to EDU Chain
                </CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Your gateway to verifiable career credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!walletConnected ? (
                  <div className="text-center p-6">
                    <Database className="h-12 w-12 text-[#00EDBE] mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400 mb-6">
                      To interact with EDU Chain, you need to connect your Ethereum wallet first.
                    </p>
                    <Button
                      onClick={connectWallet}
                      className="bg-gradient-to-r from-[#141BEB] to-[#00EDBE] hover:opacity-90 transition-opacity text-white"
                    >
                      Connect Wallet
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Connection Status Panel */}
                    <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-3">Connection Status</h3>
                      
                      {/* Wallet Connection */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-[#00EDBE]" />
                          <span className="text-sm text-gray-300">Wallet Connected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {account ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-xs text-green-400">{account.slice(0, 6)}...{account.slice(-4)}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-400" />
                              <span className="text-xs text-red-400">Not Connected</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* OCID Connection */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-[#00EDBE]" />
                          <span className="text-sm text-gray-300">OCID Connection</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {authState.ethAddress ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-xs text-green-400">
                                {authState.ethAddress.slice(0, 6)}...{authState.ethAddress.slice(-4)}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-400" />
                              <span className="text-xs text-red-400">Not Connected</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Wallet Match Status */}
                      {account && authState.ethAddress && (
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-[#00EDBE]" />
                            <span className="text-sm text-gray-300">Wallet Matches OCID</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {walletMatchesOCID ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-xs text-green-400">Verified</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-400" />
                                <span className="text-xs text-red-400">Mismatch</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Network Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-[#00EDBE]" />
                          <span className="text-sm text-gray-300">EDU Chain Testnet</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {networkStatus.checking ? (
                            <span className="text-xs text-yellow-400 flex items-center gap-1">
                              <div className="h-3 w-3 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                              Checking...
                            </span>
                          ) : networkStatus.isCorrectNetwork ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-xs text-green-400">Connected</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-400" />
                              <Button 
                                variant="link" 
                                className="text-xs text-[#00EDBE] p-0 h-auto" 
                                onClick={switchNetwork}
                              >
                                Switch Network
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Network Details */}
                      {networkStatus.isCorrectNetwork && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Connected to EDU Chain Testnet (Chain ID: 656476, Currency: EDU)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* EDU Token Info */}
                    <Alert className="bg-blue-900/20 border-blue-900/30 text-blue-300">
                      <AlertCircle className="h-4 w-4" />
                      <div>
                        <AlertTitle className="text-blue-200 font-medium text-sm">Important</AlertTitle>
                        <AlertDescription className="flex flex-col gap-1">
                          <span>We will be sending transaction requests to the wallet address associated with your OCID.</span>
                          <div>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-300 underline text-xs" 
                              onClick={toggleEduInfo}
                            >
                              {eduInfo ? "Hide details" : "Show details"}
                            </Button>
                          </div>
                          {eduInfo && (
                            <div className="text-xs mt-1 text-blue-200">
                              <p>Make sure to have enough EDU tokens in your account.</p>
                              <p className="mt-1">
                                If not available, get tokens from:
                                <a 
                                  href="https://www.hackquest.io/faucets/656476" 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[#00EDBE] ml-1 flex items-center gap-1 inline-flex"
                                >
                                  hackquest.io faucet
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </p>
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>

                    {error && (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-900/30 text-red-300">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {txHash && (
                      <Alert className="bg-green-900/20 border-green-900/30 text-green-300">
                        <FileCheck className="h-4 w-4" />
                        <AlertDescription>
                          Transaction submitted! Track it{" "}
                          <a
                            href={`https://edu-chain-testnet.blockscout.com/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            here
                          </a>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">Your Name</label>
                        <Input
                          placeholder="Enter your name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-black/40 border-white/10 focus:border-[#00EDBE]/50 text-white"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox
                            id="shareName"
                            checked={formData.shareName}
                            onCheckedChange={() => handleCheckboxChange("shareName")}
                            className="data-[state=checked]:bg-[#00EDBE] data-[state=checked]:border-[#00EDBE]"
                          />
                          <label htmlFor="shareName" className="text-xs text-gray-400 flex items-center gap-1">
                            Share my name on EDU Chain
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Your name will be stored as part of your DID on EDU Chain</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300">Your Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-black/40 border-white/10 focus:border-[#00EDBE]/50 text-white"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox
                            id="shareEmail"
                            checked={formData.shareEmail}
                            onCheckedChange={() => handleCheckboxChange("shareEmail")}
                            className="data-[state=checked]:bg-[#00EDBE] data-[state=checked]:border-[#00EDBE]"
                          />
                          <label htmlFor="shareEmail" className="text-xs text-gray-400 flex items-center gap-1">
                            Share my email on EDU Chain
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Your email will be encrypted and only shared with approved recruiters</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300">Your Message (Required)</label>
                        <Textarea
                          placeholder="Share why you're joining Ghosted..."
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="bg-black/40 border-white/10 focus:border-[#00EDBE]/50 text-white min-h-24"
                          required
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          This message will be stored on EDU Chain testnet and visible to the community
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">User Type</label>
                        <RadioGroup
                          value={formData.userType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, userType: value }))}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="0"
                              id="applicant"
                              className="data-[state=checked]:bg-[#00EDBE] data-[state=checked]:border-[#00EDBE]"
                            />
                            <Label htmlFor="applicant" className="text-gray-300">
                              Applicant
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="1"
                              id="recruiter"
                              className="data-[state=checked]:bg-[#00EDBE] data-[state=checked]:border-[#00EDBE]"
                            />
                            <Label htmlFor="recruiter" className="text-gray-300">
                              Recruiter
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#141BEB] to-[#00EDBE] hover:opacity-90 transition-opacity text-white"
                      disabled={isSubmitting || !authState.ethAddress || !networkStatus.isCorrectNetwork || !walletMatchesOCID}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Connecting...
                        </>
                      ) : !networkStatus.isCorrectNetwork ? (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Switch to EDU Chain
                        </>
                      ) : !walletMatchesOCID && account && authState.ethAddress ? (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Wallet Mismatch
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Onboard to EDU Chain
                        </>
                      )}
                    </Button>

                    <div className="bg-[#141BEB]/10 border border-[#141BEB]/20 rounded-lg p-3 text-sm text-gray-300">
                      <p className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#00EDBE]" />
                        Your data will be stored on EDU Chain testnet with:
                      </p>
                      <ul className="mt-2 space-y-1 text-xs list-disc list-inside text-gray-400">
                        <li>End-to-end encryption for sensitive information</li>
                        <li>Decentralized identity (DID) for data ownership</li>
                        <li>Verifiable credentials as Soulbound Tokens</li>
                        <li>Learn-to-earn incentives through EDU tokens</li>
                      </ul>
                    </div>

                    <p className="text-xs text-center text-gray-400">
                      By connecting, you agree to our terms and privacy policy. Your data will be stored securely on EDU
                      Chain and only shared according to your preferences.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage