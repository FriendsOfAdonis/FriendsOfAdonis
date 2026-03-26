export class CurrencyFormatter {
  constructor(
    private defaultCurrency: string,
    private defaultLocale: string
  ) {}

  /**
   * Format the given amount into a displayable currency.
   */
  public formatAmount(amount: number, currency?: string, locale?: string): string {
    return new Intl.NumberFormat(locale ?? this.defaultLocale, {
      style: 'currency',
      currency: currency ?? this.defaultCurrency,
    }).format(amount / 100)
  }
}
