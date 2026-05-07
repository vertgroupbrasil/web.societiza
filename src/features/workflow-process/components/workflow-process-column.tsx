'use client';

import { useCallback, useState } from 'react';
import { Button, ScrollArea } from '@shadcn/index';
import { ChevronRight } from 'lucide-react';
import type { WorkflowProcessColumn as WorkflowProcessColumnType } from '../lib';
import { WorkflowProcessCard } from './workflow-process-card';

type WorkflowProcessColumnProps = {
  column: WorkflowProcessColumnType;
  onOpenProcess: (processId: string) => void;
};

export function WorkflowProcessColumn({
  column,
  onOpenProcess,
}: WorkflowProcessColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex-shrink-0 w-80 min-w-[320px] max-w-[400px]">
      <div className="bg-accent/30 rounded-lg border transition-all duration-300 ease-in-out h-full shadow-sm">
        {/* Header */}
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
                {column.title}
              </h3>
            </div>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded flex-shrink-0 ml-2">
              {column.items.length}
            </span>
          </div>
        </div>

        {/* Content with collapse animation */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isCollapsed
              ? 'h-0 min-h-0 opacity-0'
              : 'h-[calc(100vh-200px)] min-h-[400px] opacity-100'
          }`}
          style={{ overflow: isCollapsed ? 'hidden' : 'visible' }}
        >
          <div className="h-full">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {column.items.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                      <p className="text-sm">Nenhum processo nesta etapa</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {column.items.map((item, index) => {
                      const delay = Math.min(index * 30, 150);
                      return (
                        <div
                          key={item.id}
                          className="transform transition-all duration-200 ease-in-out"
                          style={{
                            transitionDelay: isCollapsed ? '0ms' : `${delay}ms`,
                            opacity: isCollapsed ? 0 : 1,
                            transform: isCollapsed
                              ? 'translateY(-10px) scale(0.95)'
                              : 'translateY(0) scale(1)',
                          }}
                        >
                          <WorkflowProcessCard
                            item={item}
                            onOpen={onOpenProcess}
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
}
