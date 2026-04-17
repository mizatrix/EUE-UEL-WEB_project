import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  
  const formData = await req.formData()
  const submission_id = formData.get('submission_id') as string
  const grade = formData.get('grade') as string
  const feedback = formData.get('feedback') as string | null
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !submission_id || !grade) {
    return NextResponse.redirect(new URL('/admin?error=Missing data', req.url), { status: 302 })
  }

  // Authorize instructor role (RLS will also catch this but good to have explicit check)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'instructor') {
    return NextResponse.redirect(new URL('/dashboard', req.url), { status: 302 })
  }

  const { error } = await supabase
    .from('submissions')
    .update({
      grade: parseInt(grade, 10),
      status: 'graded',
      feedback: feedback || null,
    })
    .eq('id', submission_id)

  if (error) {
    console.error("Grading error:", error)
    return NextResponse.redirect(new URL(`/admin?error=${error.message}`, req.url), { status: 302 })
  }

  revalidatePath('/admin', 'page')
  return NextResponse.redirect(new URL('/admin', req.url), { status: 302 })
}
