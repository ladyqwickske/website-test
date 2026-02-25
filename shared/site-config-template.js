/**
 * Site Configuration Template
 * 
 * Copy this file to each clan's folder and customize the values:
 * - cCc/GoogleAppsScript/pages/site-config.js
 * - MOO/GoogleAppsScript/pages/site-config.js
 */

const SITE_CONFIG = {
  // Clan Identity
  clanName: 'Clan Name',              // Display name (e.g., "cCc Champions")
  clanAbbr: 'ABC',                    // Abbreviation for localStorage keys (e.g., "ccc")
  
  // Branding
  primaryColor: '#ffb300',             // Main accent color (buttons, headings, active states)
  secondaryColor: '#232526',           // Secondary color (backgrounds)
  favicon: 'favicon.png',              // Path to favicon
  
  // Authentication
  googleClientId: '47674606892-0m90hd0cd01kijo69ssuqtn1j3igp32i.apps.googleusercontent.com',
  
  // Navigation Pages
  pages: [
    { name: 'Dashboard', file: 'dashboard.html', icon: 'chests.png' },
    { name: 'Events', file: 'events.html', icon: 'events.png' },
    { name: 'Members', file: 'members.html', icon: 'members.png' },
    { name: 'Troops', file: 'troops.html', icon: 'troops.png' },
    { name: 'Progress', file: 'progress.html', icon: 'progress.png' }
  ]
};
