'use client';
import { useParams } from 'next/navigation';
import LibraryPage from '../page';

export default function LibraryDetailPage() {
  const params = useParams();
  return <LibraryPage initialNoteId={params.id as string} />;
}
