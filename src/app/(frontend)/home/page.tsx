'use client'
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"

type Program = {
  id: string
  title: string
  subtitle: string
  explanation: string
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [programs, setPrograms] = useState<Program[]>([])
  // const [ selectedProgram, setSelectedProgram ] = useState<Program | null>(null)
  const [ formData, setFormData ] = useState({
    title: '',
    subtitle: '',
    explanation: '',
    emails: ''
  })

  useEffect(() => {
    if (session) {
      fetch('/api/program')
      .then(res => res.json())
      .then(data => setPrograms(data.programs))
    }
  }, [session])


  const handleCreateProgram = async () => {
    const res = await fetch('/api/program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ ...formData, emails: formData.emails.split(',').map(e => e.trim()) }),
    })

    if(res.ok) {
      const data = await res.json()
      setPrograms(prev => [...prev, data.program])
      setFormData({ title: '', subtitle: '', explanation: '', emails: '' })
  }
}

  if (status === "loading") return <div>Loading...</div>

  if (!session) {
    return (
      <div>
        <h1>Welcome to the LMs</h1>
        <button onClick={() => signIn("google", {prompt: "consent select_account"})}>Continue with Google</button>
      </div>
    )
  }

  const { name, email, role } = session.user

  /* main page */
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p>

    {session.user.image && (
      <Image src={session.user.image} alt="Profile" width={100} height={100} />
      )}

      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>

      {/* for beneficiary */}
      {session.user.role === 'BENEFICIARY' && (
        <button>for BENEFICIARY</button>
      )}

      {session.user.role === 'ADMIN' && (
        <>
          <h2>Create Program</h2>
          <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value})} />
          <input placeholder="subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value})} />
          <input placeholder="explanation" value={formData.explanation} onChange={(e) => setFormData({ ...formData, explanation: e.target.value})} />
          <input placeholder="Emails (comma-separated)" value={formData.emails} onChange={(e) => setFormData({ ...formData, emails: e.target.value})} />
          <button onClick={handleCreateProgram}>Create Program</button>
        </>
      )}

      <h2>Your Programs</h2>
      {programs.map(program => (
        <div key={program.id}>
          <Link href={`/program/${program.id}`}>
            <h3 className="cursor text-blue">{program.title}</h3>
          </Link>
          
        {session.user.role === 'ADMIN' && (<>
          <input placeholder="Add emails to program" onKeyDown={async e => {
            if (e.key === 'Enter') {
              const emails = (e.currentTarget as HTMLInputElement).value
              await fetch(`/api/program/${program.id}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: emails.split(',').map(e => e.trim()) })
              })
              e.currentTarget.value = ''
              alert('Emails add to program')
            }
          }}
          />
        </>)}
          
        </div>
      ))}


      {/* for Instructors */}
      {session.user.role === 'INSTRUCTOR' && (
        <button>for INSTRUCTOR</button>
      )}

      
    </div>
  )
}
