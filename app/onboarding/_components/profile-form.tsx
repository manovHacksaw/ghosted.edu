"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

interface ProfileFormProps {
  onSubmit: (data: any) => void
}

export function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-white">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          required
          value={formData.email}
          onChange={handleChange}
          className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="bg-black/50 border-[#DDDDFB]/20 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="bg-black/50 border-[#DDDDFB]/20 text-white"
        />
      </div>
      <Button type="submit" className="w-full bg-[#1418EB] text-white hover:bg-[#1418EB]/80">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
