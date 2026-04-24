'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@societiza/components/ui/shadcnui/breadcrumb';

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  configuracoes: 'Configurações',
  preferencias: 'Preferências',
  perfil: 'Perfil',
  escritorio: 'Escritório',
  membros: 'Membros',
  plano: 'Plano',
  ajuda: 'Ajuda',
  alvaras: 'Alvarás',
  societario: 'Societário',
  contratos: 'Contratos',
  'certificados-digitais': 'Certificados digitais',
  gerenciamento: 'Gerenciamento',
};

function getSegmentLabel(segment: string) {
  return (
    SEGMENT_LABELS[segment] ??
    segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'dashboard') return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap overflow-hidden">
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          const label = getSegmentLabel(segment);

          return (
            <BreadcrumbItem key={href} className="min-w-0">
              {index > 0 && <BreadcrumbSeparator />}
              {isLast ? (
                <BreadcrumbPage className="truncate">{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href} className="truncate">
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
