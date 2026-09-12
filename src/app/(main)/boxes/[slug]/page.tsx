import { redirect } from 'next/navigation';

export default async function BoxDetailRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/venues/${slug}`);
}
