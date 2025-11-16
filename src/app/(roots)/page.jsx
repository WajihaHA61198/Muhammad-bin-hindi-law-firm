import { HeroSlider } from "@/components";
import OurTeam from "@/components/OurTeam";
import ClientDiaries from "@/components/ClientDiaries";
import { getHeroSlides, getTeamMembers, getTestimonials } from "@/lib/strapi";

export default async function Home() {
  const [slides, team, testimonials] = await Promise.all([
    getHeroSlides(),
    getTeamMembers(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSlider initialSlides={slides} />
      <OurTeam initialTeam={team} />
      <ClientDiaries initialTestimonials={testimonials} priority="false" />
    </>
  );
}
export const revalidate = 3600;
