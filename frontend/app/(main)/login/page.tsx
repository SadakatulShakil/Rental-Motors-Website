"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      router.replace("/admin") // smooth redirect
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const body = new URLSearchParams({
        username,
        password
      }).toString()

      const res = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      })

      if (!res.ok) {
        setError("Invalid credentials")
        return
      }

      const data = await res.json()
      localStorage.setItem("admin_token", data.access_token)

      router.replace("/admin")
    } catch (err) {
      console.error(err)
      setError("Login failed")
    }
  }

  // ⛔ Prevent flicker while checking auth
  if (checkingAuth) return null

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl text-black font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 text-black rounded w-full mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 text-black rounded w-full mb-6"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}
