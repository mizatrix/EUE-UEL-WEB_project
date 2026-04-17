'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Provide a friendlier message for unconfirmed emails
    if (error.message.toLowerCase().includes('email not confirmed')) {
      redirect('/login?error=Email not confirmed. Please check your inbox (and spam folder) for the confirmation link.')
    }
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // EUE / UEL Domain Verification
  const allowedDomains = ['@eue.edu.eg', '@uel.eue.edu.eg', '@uel.ac.uk', '@student.uel.ac.uk']
  if (!allowedDomains.some(domain => email.endsWith(domain))) {
    redirect('/login?error=Only official EUE / UEL institutional emails are permitted.')
  }

  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // After successful signup, show a message about email confirmation
  redirect('/login?success=Account created! Check your email inbox to confirm, then log in.')
}
