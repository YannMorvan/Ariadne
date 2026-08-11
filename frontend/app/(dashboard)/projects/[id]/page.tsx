import ProjectDetailsClient from "@/components/projects/views/project-details-client"

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params
  return <ProjectDetailsClient id={id} />
}
