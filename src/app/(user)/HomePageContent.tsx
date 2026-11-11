import Link from "next/link";
import { Phone } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import {
  CategorySidebar,
  HeroSlideshow,
  HomeProductSections,
  MobileCategoryButton,
  PromoBannerCarousels,
} from "@/features/homepage";

function CompactCta() {
  return (
    <section className="bg-card flex flex-col items-start justify-between gap-4 rounded-xl border px-5 py-5 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">
          Need help choosing?
        </h2>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Talk to our team about the right laptop or PC for your needs.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm">
          <a href={SITE.phoneHref}>
            <Phone className="size-4" />
            {SITE.phoneDisplay}
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={ROUTES.contact}>Contact us</Link>
        </Button>
      </div>
    </section>
  );
}

export function HomePageContent() {
  return (
    <PageWrapper className="space-y-6 py-4 sm:py-6">
      <div className="grid gap-3 lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-4">
        <CategorySidebar />
        <div className="min-w-0 space-y-3">
          <MobileCategoryButton />
          <HeroSlideshow />
        </div>
      </div>

      <PromoBannerCarousels />
      <HomeProductSections />
      <CompactCta />
    </PageWrapper>
  );
}
