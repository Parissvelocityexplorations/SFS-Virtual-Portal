import type { MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Space Force Admin Panel" },
    { name: "description", content: "Admin dashboard for Space Force Visitor Management" },
  ];
};

export function loader() {
  // Redirect to the appointments view as the default admin page
  return redirect('/admin/appointments');
}