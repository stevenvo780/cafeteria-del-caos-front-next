'use client';
import LibraryPage from '../page';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function LibraryLoader({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <LibraryPage initialNoteId={resolvedParams.id} />;
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LibraryLoader params={props.params} />
    </Suspense>
  );
}
