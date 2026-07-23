import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProjectGrid, type ProjectCard } from "@/components/project-grid";
import { projects as fallbackProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore selected POS, CCTV, web, biometric and networking projects delivered by Sysnettech Solutions.",
};
type CmsProject = {
  id: number;
  title: string;
  excerpt?: string | null;
  data?: {
    category?: string;
    client?: string;
    download_path?: string;
    download_name?: string;
  } | null;
};

async function getProjects(): Promise<ProjectCard[] | null> {
  const internalApi =
    process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  const publicApi = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

  try {
    const response = await fetch(`${internalApi}/content/projects`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    return (payload.data ?? []).map((project: CmsProject, index: number) => {
      const fallback = fallbackProjects.find((item) => item.title === project.title);
      return {
        title: project.title,
        category: project.data?.category || fallback?.category || "ICT Project",
        client: project.data?.client || fallback?.client || "Sysnettech client",
        summary: project.excerpt || undefined,
        tone:
          fallback?.tone ??
          [
            "from-[#09265e] to-[#00a99d]",
            "from-slate-900 to-[#0a2a66]",
            "from-[#00a99d] to-cyan-800",
            "from-[#0a2a66] to-indigo-700",
          ][index % 4],
        downloadUrl: project.data?.download_path
          ? `${publicApi}/portfolio-downloads/${project.id}`
          : undefined,
        downloadName: project.data?.download_name,
      };
    });
  } catch {
    return null;
  }
}

export default async function Portfolio() {
  const projects = await getProjects();
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Solutions working in the real world."
        description="Explore how we help organisations improve visibility, efficiency, security and customer experience."
      />
      <section className="py-20">
        <div className="container-site">
          <ProjectGrid items={projects ?? undefined} />
        </div>
      </section>
    </>
  );
}
