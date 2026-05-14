'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/index';
import { ThemeSwitcher } from '@societiza/components/ui/kiboui/theme-switcher';

export function SettingsPreferencesScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Preferências</h1>
        <p className="text-sm text-muted-foreground">
          Ajuste como o Societiza aparece para você.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Escolha entre tema claro, escuro ou automático pelo sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitcher className="w-fit" />
        </CardContent>
      </Card>
    </div>
  );
}
