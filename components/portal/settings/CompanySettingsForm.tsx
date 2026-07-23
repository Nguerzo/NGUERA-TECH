"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCompanySettings } from "@/app/actions/settings";

export type CompanySettingsData = {
  companyName: string;
  companyEmail: string | null;
  companyPhone: string | null;
  defaultCurrency: string;
};

export function CompanySettingsForm({ settings }: { settings: CompanySettingsData }) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateCompanySettings(formData);
      if (!result.ok) toast.error(result.error);
      else toast.success("Paramètres mis à jour");
    });
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
        <Input id="companyName" name="companyName" defaultValue={settings.companyName} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="companyEmail">Email</Label>
          <Input id="companyEmail" name="companyEmail" type="email" defaultValue={settings.companyEmail ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="companyPhone">Téléphone</Label>
          <Input id="companyPhone" name="companyPhone" defaultValue={settings.companyPhone ?? ""} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="defaultCurrency">Devise par défaut</Label>
        <Select name="defaultCurrency" defaultValue={settings.defaultCurrency}>
          <SelectTrigger id="defaultCurrency" className="max-w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="FCFA">FCFA</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Langues prises en charge : Anglais (EN-GB), Français.</p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}
