// src/app/admin/layout.tsx
import AdminLayout from '../../../modules/admin/components/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

