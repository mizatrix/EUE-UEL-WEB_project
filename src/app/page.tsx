import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Rubric from "@/components/Rubric";
import ProjectGrid from "@/components/ProjectGrid";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch taken projects
  const { data: teams } = await supabase.from('teams').select('project_id, team_name');
  
  // Create a mapping of project_id -> team_name
  const takenProjects: Record<number, string> = {};
  if (teams) {
    teams.forEach(team => {
      takenProjects[team.project_id] = team.team_name;
    });
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Rubric />
        <ProjectGrid takenProjects={takenProjects} />
      </main>
      <Footer />
    </>
  );
}
