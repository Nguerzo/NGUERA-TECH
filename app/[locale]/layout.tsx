import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import { CurrencyProvider } from "@/components/marketing/CurrencyProvider";
import { defaultCurrencyForLocale, type CurrencyCode } from "@/lib/currency";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const cookieStore = await cookies();
  const savedCurrency = cookieStore.get("nguera-currency")?.value as CurrencyCode | undefined;
  const initialCurrency = savedCurrency ?? defaultCurrencyForLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <CurrencyProvider initialCurrency={initialCurrency}>{children}</CurrencyProvider>
    </NextIntlClientProvider>
  );
}
