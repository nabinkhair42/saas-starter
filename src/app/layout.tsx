import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import AppRootProvider from '@/providers/app-root-provider';
import { metadata } from '@/seo/metadata';
import '@/styles/globals.css';
export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-foreground group/body theme-blue overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]">
        <AppRootProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppRootProvider>
      </body>
    </html>
  );
}
