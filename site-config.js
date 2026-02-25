/**
 * MOO Site Configuration
 */

const SITE_CONFIG = {
  // Clan Identity
  clanName: 'Masters Of Oops',
  clanAbbr: 'moo',
  
  // Branding - can customize colors for MOO if desired
  primaryColor: '#ffb300',
  secondaryColor: '#232526',
  favicon: 'favicon.png',
  
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
