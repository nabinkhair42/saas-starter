import Link from 'next/link';

import { Icons } from '@/components/icons';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { source } from '@/lib/docs-source';
import { siteConfig } from '@/seo';
import { DemoButton } from './buttons/demo-app';
import { GitHubButton } from './buttons/github-repo';
import { ModeSwitcher } from './buttons/mode-switcher';

export const NavLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Changelog', href: '/changelog' },
];

export function SiteHeader() {
  const pageTree = source.pageTree;

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="container-wrapper mx-auto max-w-5xl px-4 lg:px-0">
        <div
          className="3xl:fixed:container flex items-center gap-2 **:data-[slot=separator]:!h-4
          h-[var(--header-height)]
        "
        >
          <MobileNav tree={pageTree} items={NavLinks} className="flex lg:hidden" />
          <Button asChild variant="ghost" size="icon" className="hidden size-8 lg:flex">
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <MainNav items={NavLinks} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <DemoButton />
            <Separator orientation="vertical" />

            <GitHubButton />
            <Separator orientation="vertical" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
