import { redirect } from 'next/navigation';

// Medicine Information now lives inside the combined Health Tools page.
// This route is kept so old bookmarks/links don't break.
export default function MedicineInfoRedirect() {
  redirect('/health-tools?tab=medicine');
}
