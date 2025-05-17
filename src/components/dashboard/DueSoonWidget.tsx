import React from 'react';
import { DashboardCardWrapper } from './DashboardCardWrapper';

export function DueSoonWidget() {
  return (
    <DashboardCardWrapper title="DUE SOON" className="min-h-[120px]" contentClassName="flex items-center justify-start pt-1"> {/* Adjusted alignment and padding */}
      <p className="text-sm text-muted-foreground">Nothing due soon.</p>
    </DashboardCardWrapper>
  );
}
