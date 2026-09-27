import { format } from 'date-fns';

/**
 * Safely format any date value (string, timestamp, Date, undefined, null)
 * Never throws RangeError: Invalid time value
 */
export function safeFormatDate(
  dateVal: any,
  formatString: string = 'dd/MM/yyyy',
  fallback: string = '—'
): string {
  if (!dateVal) return fallback;

  try {
    let d: Date;
    if (dateVal instanceof Date) {
      d = dateVal;
    } else if (typeof dateVal === 'number') {
      d = new Date(dateVal);
    } else if (typeof dateVal === 'string') {
      const s = dateVal.trim();
      if (!s) return fallback;

      // Handle Vietnamese DD/MM/YYYY or DD-MM-YYYY format
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
      if (dmy) {
        const day = parseInt(dmy[1], 10);
        const month = parseInt(dmy[2], 10) - 1;
        const year = parseInt(dmy[3], 10);
        const h = parseInt(dmy[4] || '0', 10);
        const min = parseInt(dmy[5] || '0', 10);
        const sec = parseInt(dmy[6] || '0', 10);
        d = new Date(year, month, day, h, min, sec);
      } else {
        d = new Date(s);
      }
    } else {
      return fallback;
    }

    if (isNaN(d.getTime())) {
      return typeof dateVal === 'string' && dateVal.trim() ? dateVal.trim() : fallback;
    }

    return format(d, formatString);
  } catch {
    return typeof dateVal === 'string' && dateVal.trim() ? dateVal.trim() : fallback;
  }
}
