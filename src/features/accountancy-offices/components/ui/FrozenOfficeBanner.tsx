import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@shadcn/index';

interface FrozenOfficeBannerProps {
  reason?: 'members' | 'processes' | 'general';
}

const REASON_MESSAGES: Record<NonNullable<FrozenOfficeBannerProps['reason']>, { title: string; description: string }> = {
  members: {
    title: 'Escritório congelado — limite de membros excedido',
    description:
      'O escritório está congelado porque o número de membros excede o limite do plano atual. Apenas o owner pode acessar. Remova membros até atingir o limite do plano para descongelar.',
  },
  processes: {
    title: 'Limite de processos atingido',
    description:
      'Você atingiu o limite de processos do plano atual. Não é possível criar novos processos. Delete processos existentes ou faça upgrade do plano.',
  },
  general: {
    title: 'Escritório congelado',
    description:
      'Este escritório está temporariamente congelado. Entre em contato com o owner para mais informações.',
  },
};

export function FrozenOfficeBanner({
  reason = 'general',
}: FrozenOfficeBannerProps) {
  const { title, description } = REASON_MESSAGES[reason];

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
