function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [checking, setChecking] = useState(true)
  
    useEffect(() => {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.replace("/admin/login")
      } else {
        setChecking(false)
      }
    }, [router])
  
    if (checking) return <div>Loading...</div>
    return <>{children}</>
  }
  import { useEffect, useState } from "react"
  import { useRouter } from "next/navigation"
  export default AdminGuard