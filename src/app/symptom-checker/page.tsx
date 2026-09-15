import { redirect } from 'next/navigation';

// Symptom Checker now lives inside the combined Health Tools page.
// This route is kept so old bookmarks/links don't break.
export default function SymptomCheckerRedirect() {
  redirect('/health-tools?tab=symptoms');
}
