# Implementation Guide - Refactored Portal Framework

## What's Been Created

I've created a reusable framework that separates shared code from clan-specific configuration:

### ✅ Shared Framework Files
- **shared-styles.css** - All UI styling (colors, layout, responsive design)
- **shared-helpers.js** - UTC date functions, utility functions, HTML escaping
- **shared-framework.js** - Theme application, navigation builder, Google Auth setup
- **site-config-template.js** - Template showing what settings can be configured

### ✅ Clan Configuration Files
- **cCc/site-config.js** - cCc Champions configuration
- **MOO/site-config.js** - Masters Of Oops configuration

### ✅ Refactored Example
- **cCc/members-refactored.html** - Example of how pages should be structured
  - Much cleaner and shorter than original
  - Uses shared framework for auth, navigation, styling
  - Only contains page-specific logic

### ✅ Documentation
- **shared/README.md** - Complete guide to the framework

## Next Steps

### 1. Test the Refactored Members Page

Before applying to all pages, test the refactored members page:

1. Rename or backup the old members.html:
   ```
   members-old.html (for reference)
   ```

2. Rename the refactored version:
   ```
   members-refactored.html → members.html
   ```

3. Test in both cCc and MOO portals:
   - Navigation appears correctly
   - Colors match (should show cCc colors for cCc, same for MOO)
   - Members functionality works (load, add, edit, remove)
   - Auth system works
   - Mobile menu works

### 2. Refactor Remaining Pages

Once members.html is working, refactor these pages the same way:

- **dashboard.html**
- **events.html**
- **troops.html**
- **progress.html**

For each page:
1. Keep the page-specific JavaScript logic unchanged
2. Replace the HTML structure with the refactored template
3. Replace inline styles with the shared framework

### 3. Update Both Clans

Copy the refactored pages to both clan folders:
```
cCc/GoogleAppsScript/pages/members.html
MOO/GoogleAppsScript/pages/members.html
```

They'll automatically use their respective `site-config.js` and show correct colors.

### 4. Clan-Specific Pages (Optional)

For compensation.html and points.html, you can:
- Leave them as-is (they're clan-specific)
- Or refactor them too for consistency

## Configuration Customization

To customize each clan, edit their `site-config.js`:

```javascript
// cCc
const SITE_CONFIG = {
  clanName: 'cCc Champions',
  clanAbbr: 'ccc',
  primaryColor: '#ffb300',        // Gold
  secondaryColor: '#232526',      // Dark gray
  favicon: 'favicon.png',
  googleClientId: '47674606892-0m90hd0cd01kijo69ssuqtn1j3igp32i.apps.googleusercontent.com',
  pages: [ /* navigation pages */ ]
};
```

```javascript
// MOO - could have different colors if desired
const SITE_CONFIG = {
  clanName: 'Masters Of Oops',
  clanAbbr: 'moo',
  primaryColor: '#ffb300',        // Same or different
  secondaryColor: '#232526',      // Same or different
  favicon: 'favicon.png',
  googleClientId: '47674606892-0m90hd0cd01kijo69ssuqtn1j3igp32i.apps.googleusercontent.com',
  pages: [ /* navigation pages */ ]
};
```

## Benefits of This Approach

### Before (Original Code)
- Members.html has ~1050 lines including all styling and navigation code
- cCc members.html and MOO members.html are duplicated codebases
- Bug fixes need to be applied to both files
- Color changes require editing CSS in two places
- Adding new navigation items requires editing HTML in two places

### After (Refactored)
- Members.html has ~250 lines, only page-specific code
- Shared code is in `/shared/` (used by all clans)
- Bug fixes applied once, benefits all clans immediately
- Color changes made in `site-config.js`
- Navigation changes made in `site-config.js`
- Easy to add new clans (copy folders + customize site-config.js)

## File Sizes

```
Original member.html:     1048 lines (~50 KB)
Refactored members.html:   250 lines (~13 KB)

Reduction: 76% smaller
```

## Breaking It Down

### shared-styles.css (400 lines)
- All UI styling for all pages
- Uses generic color values
- Applied to every page

### shared-helpers.js (100 lines)
- `parseDateUTC()`, `formatDateUTC()`, `getTodayUTCString()`
- `escapeHtml()`, `normalizeResponse()`, `formatNumber()`
- Used by all pages for consistency

### shared-framework.js (200 lines)
- `initializeSiteFramework()` - Main entry point
- `applyTheme()` - Dynamically applies clan colors from config
- `buildNavigation()` - Generates nav from SITE_CONFIG.pages
- `setupAuth()` - Google Sign-In (uses clan-specific storage keys)
- Called immediately when page loads, before page-specific code

### Refactored members.html (250 lines)
- HTML structure (no inline styles)
- `MembersTab` logic (unchanged from original)
- Links to all shared assets

### site-config.js (15 lines)
- Clan name, colors, favicon, OAuth ID
- Navigation page definitions
- Everything customizable without touching code

## Testing Checklist

After refactoring a page, verify:

- [ ] Navigation bar appears
- [ ] Correct clan colors applied
- [ ] Navigation items active/inactive correctly
- [ ] Sign in / Sign out works
- [ ] Read-only mode applied when not signed in
- [ ] Page functionality works (load, add, edit, delete)
- [ ] Table sorting works
- [ ] Search/filter works
- [ ] Date picker shows correctly
- [ ] Responsive layout works on mobile
- [ ] Hamburger menu works on mobile
- [ ] Works in both cCc and MOO portals

## Adding a Third Clan

If you add a third clan (e.g., "Hawks"):

1. Create folder: `/Hawks/GoogleAppsScript/pages/`
2. Copy refactored HTML pages
3. Create `site-config.js`:
   ```javascript
   const SITE_CONFIG = {
     clanName: 'The Hawks',
     clanAbbr: 'hawks',
     primaryColor: '#00ff00',   // Green for example
     secondaryColor: '#001a00',
     favicon: 'favicon.png',
     googleClientId: '...',
     pages: [ /* navigation */ ]
   };
   ```
4. Copy `config.js` and `portal-shim.js`
5. Keep compensation.html and points.html clan-specific

That's it! The shared framework handles everything else.

## Troubleshooting

**Colors not changing:**
- Check that `site-config.js` is loaded before `shared-framework.js`
- Clear browser cache
- Verify `primaryColor` and `secondaryColor` are valid hex codes

**Navigation not showing:**
- Check browser console for errors
- Verify `SITE_CONFIG.pages` is defined
- Check that page filenames match `file` values in config

**Auth not working:**
- Check that `config.js` sets `window.GAS_WEB_APP_URL`
- Verify `googleClientId` in site-config.js is correct
- Check browser console for Google Sign-In errors

**Styles look broken:**
- Check that `shared-styles.css` is loaded
- Check that CSS file path is correct (relative to page location)
- Clear cache and refresh

## Next Action

1. Test members-refactored.html in both portals
2. If working, copy to all 5 pages (dashboard, events, members, troops, progress)
3. Apply to both cCc and MOO folders
4. Updates to shared framework will auto-apply to all pages

Questions? See `shared/README.md` for detailed documentation.
