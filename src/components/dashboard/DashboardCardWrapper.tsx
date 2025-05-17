import React from 'react';
import { MoreHorizontal } from 'lucide-react'; // Keeping MoreHorizontal as per mockup
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface DashboardCardWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  onMoreOptions?: () => void;
  onClick?: () => void;
  titleClassName?: string;
}

export function DashboardCardWrapper({ title, children, className, contentClassName, onMoreOptions, onClick, titleClassName }: DashboardCardWrapperProps) {
  return (
    <Card 
      className={cn(
        "bg-card border-border text-foreground flex flex-col",
        onClick ? "cursor-pointer hover:border-primary/70" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className={cn("text-lg font-semibold text-primary", titleClassName)}>{title}</CardTitle> {/* Title color to primary */}
        {onMoreOptions && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => { e.stopPropagation(); onMoreOptions(); }} 
            className="text-muted-foreground hover:text-foreground w-8 h-8 p-0"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className={cn("px-4 pb-4 flex-grow", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
