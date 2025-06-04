'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@flowtec/lib/utils';

// Context for column state
const ColumnContext = createContext<{
  isCollapsed: boolean;
  toggleCollapsed: () => void;
} | null>(null);

// Main Columns wrapper component
interface ColumnsProps {
  children: React.ReactNode;
  className?: string;
}

export function Columns({ children, className }: ColumnsProps) {
  return (
    <div className={cn('flex gap-6 p-6 overflow-x-auto', className)}>
      {children}
    </div>
  );
}

// Individual Column component
interface ColumnProps {
  children: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

export function Column({
  children,
  className,
  defaultCollapsed = false,
}: ColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ColumnContext.Provider value={{ isCollapsed, toggleCollapsed }}>
      <div
        className={cn(
          'flex flex-col min-w-[300px] max-w-[350px] bg-gray-50 rounded-lg border border-gray-200',
          className,
        )}
      >
        {children}
      </div>
    </ColumnContext.Provider>
  );
}

// Column Header component
interface ColumnHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ColumnHeader({ children, className }: ColumnHeaderProps) {
  const context = useContext(ColumnContext);

  if (!context) {
    throw new Error('ColumnHeader must be used within a Column');
  }

  const { isCollapsed, toggleCollapsed } = context;

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 rounded-t-lg transition-colors',
        className,
      )}
      onClick={toggleCollapsed}
    >
      <div className="flex-1">{children}</div>
      <div className="ml-2">
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </div>
    </div>
  );
}

// Column Title component
interface ColumnTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function ColumnTitle({ children, className }: ColumnTitleProps) {
  return (
    <h3 className={cn('font-semibold text-lg text-gray-900', className)}>
      {children}
    </h3>
  );
}

// Column Description component
interface ColumnDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function ColumnDescription({
  children,
  className,
}: ColumnDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>{children}</p>
  );
}

// Column Content component
interface ColumnContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ColumnContent({ children, className }: ColumnContentProps) {
  const context = useContext(ColumnContext);

  if (!context) {
    throw new Error('ColumnContent must be used within a Column');
  }

  const { isCollapsed } = context;

  if (isCollapsed) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-3 p-4 pt-0', className)}>
      {children}
    </div>
  );
}

// Card component for content
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}
