/* Shared Helper Functions - Used by all pages */

// Parse date string as UTC with proper timezone handling
function parseDateUTC(str) {
  if (!str) return null;
  if (str instanceof Date) return str;
  const strTrim = String(str).trim();
  if (!strTrim) return null;
  // ISO 8601 with Z or offset
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(strTrim)) {
    const d = new Date(strTrim);
    return isNaN(d.getTime()) ? null : d;
  }
  // YYYY-MM-DD (treat as UTC start of day)
  if (/^\d{4}-\d{2}-\d{2}$/.test(strTrim)) {
    const d = new Date(strTrim + 'T00:00:00Z');
    return isNaN(d.getTime()) ? null : d;
  }
  // M/D/YYYY or MM/DD/YYYY (treat as UTC)
  const mdy = strTrim.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mdy) {
    const month = parseInt(mdy[1], 10) - 1;
    const day = parseInt(mdy[2], 10);
    const year = parseInt(mdy[3], 10);
    const d = new Date(Date.UTC(year, month, day, 0, 0, 0));
    return isNaN(d.getTime()) ? null : d;
  }
  // Fallback: try direct parsing with Z suffix for UTC
  const d = new Date(strTrim + 'Z');
  return isNaN(d.getTime()) ? null : d;
}

// Format date as YYYY-MM-DD using UTC
function formatDateAsUTC(date) {
  if (!date) return '';
  if (!(date instanceof Date)) return '';
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get today's date at midnight UTC (YYYY-MM-DD format)
function getTodayUTCString() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format date string as UTC date display
function formatDateUTC(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = parseDateUTC(dateStr);
    if (!date) return dateStr;
    const year = date.getUTCFullYear();
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const day = date.getUTCDate();
    return `${month} ${day}, ${year} (UTC)`;
  } catch (e) {
    return dateStr;
  }
}

// Format date and time as UTC
function formatDateTimeUTC(dateStr) {
  if (!dateStr) return '-';
  try {
    const date = parseDateUTC(dateStr);
    if (!date) return dateStr;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes} (UTC)`;
  } catch (e) {
    return dateStr;
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Normalize API response format
function normalizeResponse(result) {
  if (!result) return { success: false, error: 'No result' };
  if (result.success !== undefined) return result;
  if (Array.isArray(result)) return { success: true, data: result };
  if (result.error) return { success: false, error: result.error };
  if (result.message && !result.data) return { success: true, message: result.message };
  if (typeof result === 'object') return { success: true, data: result, ...result };
  return { success: true, data: result };
}

// Format numbers with commas
function formatNumber(num) {
  if (!num || num === 0) return '-';
  return num.toLocaleString();
}
