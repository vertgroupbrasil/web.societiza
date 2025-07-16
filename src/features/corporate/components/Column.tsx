'use client';

import React, { useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  type Process,
  ProcessCard,
  useCorporateUIContext,
} from '@corporate/index';
import { Button, ScrollArea } from '@shadcn/index';

interface KanbanColumnProps {
  stage: {
    id: string;
    nome: string;
    ordem: number;
  };
  processes: Process[];
  isVisible?: boolean;
  isLoading?: boolean;
}

export const Column = React.memo(
  ({
    stage,
    processes,
    isVisible = true,
    isLoading = false,
  }: KanbanColumnProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { fetchAndSelectProcess } = useCorporateUIContext();

    const toggleCollapse = useCallback(() => {
      setIsCollapsed(!isCollapsed);
    }, [isCollapsed]);

    const getProcessKey = (process: Process, index: number): string => {
      return process.id || `${stage.id}-${index}-${process.nome || 'unknown'}`;
    };

    const handleProcessClick = (processId: string) => {
      // ✅ Trigger para buscar dados reais
      fetchAndSelectProcess(processId);
    };

    if (!isVisible) return null;

    return (
      <div className="flex-shrink-0 w-80 min-w-[320px] max-w-[400px]">
        <div className="bg-accent/30 rounded-lg border transition-all duration-300 ease-in-out h-full shadow-sm">
          {/* HEADER FIXO */}
          <div
            className={`p-4 border-b flex-shrink-0${isCollapsed ? ' border-b-0' : ''}`}
          >
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapse}
                  className="h-6 w-6 p-0 hover:bg-muted transition-all duration-150 hover:scale-110 flex-shrink-0"
                  aria-label={isCollapsed ? 'Expandir' : 'Recolher'}
                >
                  <div
                    className={`transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
                <h3 className="font-semibold text-sm lg:text-base truncate min-w-0">
                  {stage.nome}
                </h3>
              </div>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0 ml-2">
                {processes.length}
              </span>
            </div>
          </div>

          {/* ÁREA SCROLLÁVEL COM ANIMAÇÃO DE ALTURA */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isCollapsed
                ? 'h-0 min-h-0 opacity-0'
                : 'h-[calc(100vh-200px)] min-h-[400px] opacity-100'
            }`}
            style={{
              overflow: isCollapsed ? 'hidden' : 'visible',
            }}
          >
            <div className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-24 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : processes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-fullq flex items-center justify-center">
                          <ChevronRight className="h-6 w-6" />
                        </div>
                        <p className="text-sm">Nenhum processo nesta etapa</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {processes.map((process, index) => {
                        const delay = Math.min(index * 30, 150);
                        return (
                          <div
                            key={getProcessKey(process, index)}
                            className="transform transition-all duration-200 ease-in-out"
                            style={{
                              transitionDelay: isCollapsed
                                ? '0ms'
                                : `${delay}ms`,
                              opacity: isCollapsed ? 0 : 1,
                              transform: isCollapsed
                                ? 'translateY(-10px) scale(0.95)'
                                : 'translateY(0) scale(1)',
                            }}
                          >
                            <ProcessCard
                              process={process}
                              onClick={() => handleProcessClick(process.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Column.displayName = 'Column';
