'use client';

import { Announcement, AnnouncementTag, AnnouncementTitle } from '@/components/ui/announcement-tag';
import { Button } from '@/components/ui/button';
import { ContainerTextFlip } from '@/components/ui/text-flip';
import { useDownload, useFetchStats } from '@/hooks/use-download';
import { ArrowUpRightIcon, Download } from 'lucide-react';
import Image from 'next/image';
import Reveal, { RevealY } from './reveal';

const words = ['15x faster', '10x secure', '10x safer', 'seamless'];
export default function Hero() {
  const { mutate: download, isPending } = useDownload();
  const { data: stats } = useFetchStats();

  return (
    <section className="overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Text Content */}
        <Reveal delay={0.1}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              {/* Announcement */}
              <Announcement>
                <AnnouncementTag className="bg-emerald-300">Latest update</AnnouncementTag>
                <AnnouncementTitle
                  className="cursor-pointer"
                  onClick={() =>
                    window.open('https://github.com/nabinkhair42/saas-starter', '_blank')
                  }
                >
                  Open Sourced on GitHub
                  <ArrowUpRightIcon
                    className="ml-1 shrink-0 text-muted-foreground"
                    size={16}
                    aria-hidden="true"
                  />
                </AnnouncementTitle>
              </Announcement>

              {/* Main Heading */}
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="block">Build your SaaS</span>
                <span className="block mt-2">
                  <ContainerTextFlip words={words} interval={2500} animationDuration={600} />
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Focus on building product features; not infrastructure. Start on a secure,
                production‑ready foundation so you can ship faster with confidence.
              </p>

              {/* CTA Button */}
              <div className="space-y-2">
                <Button
                  size="lg"
                  className="text-base px-8 py-3"
                  onClick={() => download()}
                  disabled={isPending}
                  loading={isPending}
                  loadingText="Preparing Download"
                >
                  Create First SaaS App
                  <Download className="h-5 w-5" aria-hidden="true" />
                </Button>
                {stats && (
                  <p className="text-sm text-muted-foreground">
                    Used by {stats.totalDownloads.toLocaleString()}+ developers
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Hero Image */}
        <div className="mt-16">
          <div className="mx-auto mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
            <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 lg:-mr-56 pl-16 lg:pl-56 relative h-[44rem]">
              {/* First Image */}
              <div className="absolute inset-0 skew-x-[.56rad] translate-y-20 translate-x-65 translate-z-[50px]">
                <RevealY delay={0.4}>
                  <Image
                    className="rounded-[4px] border dark:hidden [mask-image:linear-gradient(to_right,black_50%,transparent_100%)]"
                    src="/demo/accounts-light.png"
                    alt="Account Hero Section"
                    width={2880}
                    height={2074}
                  />
                  <Image
                    className="rounded-[4px] hidden border dark:block"
                    src="/demo/accounts-dark.png"
                    alt="Account Hero Section"
                    width={2880}
                    height={2074}
                  />
                </RevealY>
              </div>

              {/* Second Image stacked above */}
              <div className="absolute inset-0 skew-x-[.56rad] translate-z-0 translate-x-100 ">
                <RevealY delay={1.8}>
                  <Image
                    className="rounded-[4px] border dark:hidden"
                    src="/demo/edit-profile-light.png"
                    alt="Edit Profile Hero Section"
                    width={2880}
                    height={2074}
                  />
                  <Image
                    className="rounded-[4px] hidden border dark:block"
                    src="/demo/edit-profile-dark.png"
                    alt="Edit Profile Hero Section"
                    width={2880}
                    height={2074}
                  />
                </RevealY>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
