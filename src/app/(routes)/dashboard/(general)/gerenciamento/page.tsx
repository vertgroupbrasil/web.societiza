import { DataTableDemo } from '@societiza/features/management/components/data-table';

export default function Page() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header fixo */}
      <div className="flex-shrink-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="w-full max-w-full px-4 py-4 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between gap-4 w-full min-w-0">
            <div className="flex-1 min-w-0 overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                Gerenciamento
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                Gerencie e monitore todos os dados do sistema de forma
                centralizada. Visualize, edite, filtre e organize as informações
                conforme necessário.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Área de conteúdo principal */}
      <div className="flex-1 min-h-0 w-full relative">
        <div className="p-4">
          <div className="">
            <DataTableDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
