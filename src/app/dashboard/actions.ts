'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function registerTeam(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const teamName = formData.get('team_name') as string
  const projectId = Number(formData.get('project_id'))
  const membersList = formData.get('members') as string

  if (!teamName || !projectId) {
    redirect('/dashboard?error=Team name and project are required.')
  }

  // Ensure the user has a profile row (fixes FK constraint on teams.leader_id)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    const displayName = user.user_metadata?.full_name
      || user.email?.split('@')[0]
      || 'Student'

    // Use service-role client to bypass RLS (mirrors SECURITY DEFINER trigger)
    const adminClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: displayName,
        role: 'student',
      }, { onConflict: 'id', ignoreDuplicates: true })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      redirect(`/dashboard?error=${encodeURIComponent('Could not create your profile: ' + profileError.message)}`)
    }
  }

  // Check if project is already taken
  const { data: existingTeam } = await supabase
    .from('teams')
    .select('id')
    .eq('project_id', projectId)
    .single()

  if (existingTeam) {
    redirect('/dashboard?error=This project is already taken by another team.')
  }

  // Parse members into JSON array
  const members = membersList
    ? membersList.split('\n').filter(Boolean).map(line => line.trim())
    : []

  // Enforce maximum of 6 members per team
  if (members.length > 6) {
    redirect('/dashboard?error=A team can have a maximum of 6 members.')
  }

  const { error } = await supabase.from('teams').insert([
    {
      team_name: teamName,
      project_id: projectId,
      leader_id: user.id,
      members,
    },
  ])

  if (error) {
    console.error('Team registration error:', error)
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard', 'page')
  redirect('/dashboard?success=Team registered successfully!')
}
