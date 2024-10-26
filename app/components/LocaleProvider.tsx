"use client";

import { I18nProvider } from "react-aria-components";

interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  return <I18nProvider locale="es-ES">{children}</I18nProvider>;
}
