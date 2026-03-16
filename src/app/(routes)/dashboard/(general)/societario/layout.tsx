import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Societário',
  description:
    'Gestão de processos societários - abertura, alteração e baixa de empresas',
};

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Container que ocupa toda altura disponível sem overflow-hidden
    <div className="h-full w-full">{children}</div>
  );
}
