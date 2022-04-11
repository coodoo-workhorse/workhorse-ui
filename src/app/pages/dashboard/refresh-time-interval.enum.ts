export enum RefreshTimeInterval {
  REFRESH_IS_SWITCHED_OFF = 0,
  REFRESH_BY_TEN_SECONDS = 10000,
  REFRESH_BY_ONE_MINUTES = 60000,
  REFRESH_BY_TWO_MINUTES = 120000,
  REFRESH_BY_FIVE_MINUTES = 300000,
  REFRESH_BY_FIFTEEN_MINUTES = 900000
}

export function getIntervalText(intervalText: RefreshTimeInterval): string {
  switch (intervalText) {
    case RefreshTimeInterval.REFRESH_IS_SWITCHED_OFF:
      return 'Off';
    case RefreshTimeInterval.REFRESH_BY_TEN_SECONDS:
      return '10 seconds';
    case RefreshTimeInterval.REFRESH_BY_ONE_MINUTES:
      return '1 minutes';
    case RefreshTimeInterval.REFRESH_BY_TWO_MINUTES:
      return '2 minutes';
    case RefreshTimeInterval.REFRESH_BY_FIVE_MINUTES:
      return '5 minutes';
      case RefreshTimeInterval.REFRESH_BY_FIFTEEN_MINUTES:
      return '15 minutes';
    default:
      return '10 seconds';
  }
}
