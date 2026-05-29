import { notFound } from 'next/navigation';
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { source } from '@/lib/source';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams();
}

// Per-page structured data: a TechArticle (helps Google show the page as a
// developer-doc result) plus a BreadcrumbList built from the slug (renders the
// breadcrumb trail in search results).
function buildJsonLd(slug: string[] | undefined, title: string, description: string): string {
  const path = slug && slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs';
  const url = `${SITE_URL}${path}`;
  const crumbs: { name: string; href: string }[] = [
    { name: 'Home', href: '/' },
    { name: 'Docs', href: '/docs' },
  ];
  let acc = '/docs';
  for (const seg of slug ?? []) {
    if (seg === 'docs') continue;
    acc += `/${seg}`;
    crumbs.push({
      name: seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: acc,
    });
  }
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: title,
        description,
        url,
        isPartOf: { '@type': 'WebSite', name: 'MindeesUI', url: SITE_URL },
        about: { '@type': 'SoftwareSourceCode', name: 'MindeesUI' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: `${SITE_URL}${c.href}`,
        })),
      },
    ],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return {};
  const path = slug && slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs';
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: path },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const jsonLd = buildJsonLd(slug, page.data.title, page.data.description ?? '');

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}
