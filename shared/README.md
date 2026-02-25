# Shared Clan Portal Framework

This is a refactored, reusable framework for multi-clan portals. It separates shared UI/UX code from clan-specific configurations, making it easy to maintain and extend.

## Directory Structure

```
/shared/
├── shared-styles.css           # All UI styling (colors overridden by config)
├── shared-helpers.js           # UTC date functions, utility functions
├── shared-framework.js         # Auth, navigation, theme setup
└── site-config-template.js     # Template for clan configuration

/cCc/GoogleAppsScript/pages/
├── site-config.js              # cCc clan configuration
├── config.js                   # Clan-specific (unchanged)
├── portal-shim.js              # Clan-specific (unchanged)
├── compensation.html           # cCc-specific page (unchanged)
├── points.html                 # cCc-specific page (unchanged)
├── members.html                # Refactored (uses shared framework)
├── dashboard.html              # Refactored (uses shared framework)
├── events.html                 # Refactored (uses shared framework)
├── troops.html                 # Refactored (uses shared framework)
└── progress.html               # Refactored (uses shared framework)

/MOO/GoogleAppsScript/pages/
├── site-config.js              # MOO clan configuration
├── config.js                   # Clan-specific (unchanged)
├── portal-shim.js              # Clan-specific (unchanged)
├── compensation.html           # MOO-specific page (unchanged)
├── points.html                 # MOO-specific page (unchanged)
├── members.html                # Refactored (uses shared framework)
├── dashboard.html              # Refactored (uses shared framework)
├── events.html                 # Refactored (uses shared framework)
├── troops.html                 # Refactored (uses shared framework)
└── progress.html               # Refactored (uses shared framework)
```

## Configuration

Each clan has a `site-config.js` file that defines:

### Required Settings

```javascript
const SITE_CONFIG = {
  // Clan Identity
  clanName: 'cCc Champions',              // Display name
  clanAbbr: 'ccc',                        // Abbreviation (for localStorage keys)
  
  // Branding
  primaryColor: '#ffb300',                // Main accent color
  secondaryColor: '#232526',              // Secondary color
  favicon: 'favicon.png',                 // Favicon path
  
  // Authentication
  googleClientId: '47674606892-...',      // Google OAuth Client ID
  
  // Navigation Pages
  pages: [
    { name: 'Dashboard', file: 'dashboard.html', icon: 'chests.png' },
    { name: 'Events', file: 'events.html', icon: 'events.png' },
    { name: 'Members', file: 'members.html', icon: 'members.png' },
    { name: 'Troops', file: 'troops.html', icon: 'troops.png' },
    { name: 'Progress', file: 'progress.html', icon: 'progress.png' }
  ]
};
```

## How It Works

### 1. Page Load Flow

1. HTML file loads `site-config.js` (clan-specific settings)
2. Loads `config.js` and `portal-shim.js` (clan-specific backend)
3. Loads shared CSS: `shared-styles.css`
4. Loads shared helpers: `shared-helpers.js`
5. Loads shared framework: `shared-framework.js`
6. Framework initializes:
   - Applies theme colors from `SITE_CONFIG`
   - Builds navigation from `SITE_CONFIG.pages`
   - Sets up Google Auth with clan-specific storage keys
   - Initializes page-specific code

### 2. Shared Assets

**shared-styles.css**
- All the styling for all pages
- Colors are generic (#ffb300, #444, etc.)
- Clan colors applied via CSS variables from config

**shared-helpers.js**
- `parseDateUTC()` - Parse date strings with UTC handling
- `formatDateUTC()` - Format dates for display
- `getTodayUTCString()` - Get today in YYYY-MM-DD format
- `escapeHtml()` - XSS prevention
- `normalizeResponse()` - API response normalization
- `formatNumber()` - Format numbers with commas

**shared-framework.js**
- `initializeSiteFramework()` - Main initialization
- `applyTheme()` - Apply clan colors dynamically
- `buildNavigation()` - Generate nav from config
- `setupAuth()` - Google Sign-In setup
- `setupHamburgerMenu()` - Mobile menu

### 3. Page-Specific Code

Each refactored HTML page contains:
- Minimal HTML (only content structure)
- Page-specific JavaScript (e.g., `MembersTab` for members.html)
- No duplicate styling or framework code

## Maintaining and Extending

### To Fix a Bug in Shared Code

Edit the shared file (`shared-styles.css`, `shared-helpers.js`, or `shared-framework.js`), and it automatically applies to all clans' pages.

### To Add a Feature to a Page

1. Edit the page's JavaScript logic (e.g., `MembersTab` in members.html)
2. Both clans inherit the change automatically

### To Customize a Clan's Colors

Edit that clan's `site-config.js`:

```javascript
const SITE_CONFIG = {
  clanName: 'Unique Clan',
  primaryColor: '#ff00ff',      // Change primary color
  secondaryColor: '#001188',    // Change secondary color
  // ... rest of config
};
```

### To Add a New Clan

1. Create a new folder: `/NewClan/GoogleAppsScript/pages/`
2. Copy `site-config.js` template and customize it
3. Copy `config.js` and `portal-shim.js` from an existing clan and modify as needed
4. Copy all refactored HTML pages (members.html, dashboard.html, etc.)
5. Keep clan-specific pages (compensation.html, points.html) with original code

### To Use Custom Styling for One Clan

Create a `site-overrides.css` in that clan's folder and link it after the shared styles:

```html
<link rel="stylesheet" href="../../shared/shared-styles.css">
<link rel="stylesheet" href="site-overrides.css">
```

## API Compatibility

The refactored pages use:
- `window.GAS_WEB_APP_URL` - Backend URL (from config.js)
- `window.CLOUDFLARE_WORKER_URL` - Optional Cloudflare Worker (from config.js)
- `window.SITE_CONFIG` - Clan configuration (from site-config.js)

Ensure your `config.js` and `portal-shim.js` set these correctly.

## Shared Helper Functions

### Date Functions

- `parseDateUTC(str)` - Returns Date object, handles ISO 8601, YYYY-MM-DD, M/D/YYYY
- `formatDateUTC(dateStr)` - Returns "Jan 15, 2025 (UTC)"
- `formatDateTimeUTC(dateStr)` - Returns "01/15/2025 14:30 (UTC)"
- `getTodayUTCString()` - Returns today as "YYYY-MM-DD"
- `formatDateAsUTC(date)` - Returns "YYYY-MM-DD" from Date object

### Utility Functions

- `escapeHtml(text)` - XSS prevention
- `normalizeResponse(result)` - API response handling
- `formatNumber(num)` - Format with commas

## Best Practices

1. **Never edit the original members.html, dashboard.html, etc.** - Use the refactored versions
2. **Keep clan-specific pages separate** - compensation.html and points.html can stay clan-specific
3. **Update config.js for theme changes** - Don't edit HTML/CSS directly
4. **Test changes in both clans** - To ensure no regressions
5. **Document custom changes** - Add comments if you override shared styles

## Migration Notes

- Old members.html → members-refactored.html (then renamed to members.html after testing)
- Same for other pages being refactored
- Keep backup of original files before switching

## Future Enhancements

- Add more customizable colors to SITE_CONFIG
- Add theme-switching functionality
- Add locale/language support via config
- Add feature flags via config
