'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitIdea(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?error=You must be logged in to submit an idea')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  if (!title || !description || !category) {
    redirect('/ideas?error=All fields are required')
  }

  const { error } = await supabase.from('project_ideas').insert({
    title,
    description,
    category,
    proposed_by: user.id,
    is_instructor_idea: false,
    status: 'pending',
  })

  if (error) {
    console.error('Submit idea error:', error)
    redirect('/ideas?error=Failed to submit idea. Please try again.')
  }

  redirect('/ideas?success=Your idea has been submitted for review!')
}
