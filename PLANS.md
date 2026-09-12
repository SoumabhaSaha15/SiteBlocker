# SiteBlocker — Next Steps

A prioritized checklist for moving the project forward. Items are ordered so each one makes the next easier. Active Hours and Advanced Rules are intentionally excluded.

---

## Phase 1 — Foundation (do this first)

### Storage layer

- [x] Create `src/storage/keys.ts` exporting a single `KEYS` object with all storage key strings
- [x] Replace hardcoded key literals across `links.ts`, `blocker.ts`, `redirect.ts`, `password.ts`, `rules.ts`, `App.tsx` with imports from `KEYS`
- [x] Remove the duplicate key definitions and the `as` casts on read paths — validate on read consistently (you already do this in `getBlockedSites` and `getWorkingStatus`; apply the same pattern to `isSiteBlocked`, `fetchRuleList`, `getRedirect`)

### Reactive storage hook

- [ ] Create a `useStorageValue(key, defaultValue)` hook that subscribes to `browser.storage.onChanged` and re-renders on change
- [x] Replace the `useEffect(() => { getX().then(setX) }, [])` pattern in `Home`, `Rules`, `Redirect`, `Password` with this hook
- [x] This makes all pages reactive — changes in one tab/window reflect in others automatically

### Clean up dead code

- [ ] Delete `src/ResolveSite.ts` (empty function body)
- [ ] Delete `src/validator/keys.ts` (empty file)
- [ ] Remove unused imports (`Activity` in `Rules.tsx`, `Link` in `links.ts`, `React` in `ExtraConfig.tsx` and `ActiveHours.tsx`)
- [ ] Remove unused permissions from `manifest.json` if not planned soon: `webNavigation`, `declarativeNetRequestFeedback`

---

## Phase 2 — Blocking Engine (core product work)

### Switch enforcement to declarativeNetRequest

- [ ] Write a `src/utils/dnr.ts` module that converts blocked sites into DNR dynamic rules
- [ ] Use `requestDomains` for each blocked site (this handles subdomains natively — `youtube.com` blocks `www.youtube.com`, `m.youtube.com`, etc.)
- [ ] Call `chrome.declarativeNetRequest.updateDynamicRules()` whenever the blocked-sites list changes
- [ ] Keep the `tabs.onUpdated` listener as a fallback for the redirect-to-guard-page UX, but make DNR the primary blocker
- [ ] Remove the `declarativeNetRequestFeedback` permission unless you actually use matched-rule callbacks

### Fix subdomain matching (covered by DNR)

- [ ] Once DNR is in place, subdomain blocking works automatically via `requestDomains`
- [ ] If keeping the tabs listener as fallback, change `isSiteBlocked` to host-suffix matching: `host === blocked || host.endsWith("." + blocked)`

### Fix the storage-change listener key mismatch

- [ ] In `App.tsx`, the `handleStorageChange` handler reads `changes.PasswordProtected` but the actual key is `"PASSWORD-PROTECTED"` — use the `KEYS` constant from the storage layer once it exists

### Background script hardening

- [ ] Guard `URL.parse(tab.url)!` — return early if the URL is unparseable instead of throwing inside the listener
- [ ] Merge the two duplicate `onInstalled` listeners into one
- [ ] Wire up the context menu "Block this site" to actually call `blacklistSite` with `info.pageUrl ?? info.linkUrl`, or remove it if not ready

---

## Phase 3 — Rules enforcement

### Wire Rules into the blocking engine

- [ ] In `background.ts` (or a new `src/utils/rulesEngine.ts`), read `RULES-STORE` and convert active rules into DNR rules or runtime checks
- [ ] A rule with `blocked: true` should block the site when any of `blockedKeys` appear in the URL path/query
- [ ] A rule with `blocked: false` should allow the site even if it's in the blocked list (whitelist override)
- [ ] Rebuild the rule set whenever `RULES-STORE` changes (listen to `storage.onChanged`)

### Rules UI fixes

- [ ] Implement the delete handler in `Rules.tsx` (currently `() => { }`) — remove the rule from storage and update state
- [ ] Remove `console.log("message")` from the edit handler
- [ ] Add a confirmation step before deleting a rule

---

## Phase 4 — UI consistency

### Shared components

- [ ] Extract `<UrlInput />` — the TextField + InputAdornment + IconButton pattern repeated in `Home`, `Redirect`, `BlockByKeys`
- [ ] Extract `<EmptyState />` — the "red avatar + secondary text" empty list row used in `Home`, `Rules`, `Redirect`
- [ ] Extract `<SwitchListItem />` — the "avatar + switch + label" row used in `Home`, `Rules`, `Password`, `ExtraConfig`

### Finish the Redirect page

- [ ] Wire the Save button `onClick` — currently `() => { }` in `Redirect.tsx`
- [ ] Ensure the redirect URL is saved on Enter and button click

### Finish the Sync page

- [ ] Wire "Download as json" button — export `browser.storage.local.get(null)` as a JSON file (the logic already exists in `App.tsx`'s `ExportData` component, reuse it)
- [ ] Wire "Upload json" button — file input that reads a JSON file and writes it back to `storage.local`
- [ ] Replace `getSyncedData`'s N+1 key loop with a single `browser.storage.local.get(null)`
- [ ] Consider renaming "Sync" to "Backup" or "Data" since it doesn't use `storage.sync`

### Error handling consistency

- [ ] Pick one user-facing pattern: snackbars for async operation results, inline errors for form-field validation
- [ ] Apply it uniformly across all pages
- [ ] Add a top-level `<ErrorBoundary>` around `APP_MAP[app]` to catch render crashes

---

## Phase 5 — Password & security

### Strengthen password hashing

- [ ] Replace SHA-256 with PBKDF2 via `crypto.subtle.deriveBits` (100k+ iterations, random salt stored alongside the hash)
- [ ] Use `crypto.subtle.timingSafeEqual` or a constant-time compare instead of `===` for hash verification
- [ ] Bump minimum password length from 4 to 8 in `validator/password.ts`

### Password page fixes

- [ ] `await setAppPassword(newPassword)` in the reset flow — currently not awaited, success snackbar can fire before the write lands
- [ ] Add a confirm/re-enter-current-password step before disabling protection via the switch

---

## Phase 6 — Navigation & polish

### Gate unfinished pages

- [ ] Hide `BLOCK_KEYS`, `EXTRA_CONFIG`, and `ACTIVE_HOURS` from `MENU_LIST` in `constants.tsx` until they're functional
- [ ] Uncomment them back in as each feature ships
- [ ] Add a "Coming soon" badge variant for pages that are visible but in progress (optional)

### Type safety

- [ ] Convert `AppList` numeric enum to a string enum so `APP_MAP` keys are stable against reordering
- [ ] Type `getSyncedData` return as `Record<string, unknown>` instead of `Record<string, any>`

### Manifest & packaging

- [ ] Set a proper `description` field in `package.json` (currently undefined — Chrome Web Store requires it)
- [ ] Set a human-readable extension `name` (currently `site_blocker`)
- [ ] Add `action.default_title` to the manifest for the toolbar tooltip

### Small things worth doing

- [ ] Fix typo "Preffered action" → "Preferred action" (appears in `Rules.tsx` and `ExtraConfig.tsx`)
- [ ] Use `new URL(origin).hostname` for `getIcon` instead of passing the full origin to the favicon API
- [ ] Consider using the `favicon` permission's local `_favicon/` URL scheme instead of the Google favicon service — avoids a network call and doesn't leak blocked-site names
- [ ] Add a theme toggle in the app bar (light/dark) — the M3 tokens and `isDarkMode` branches already exist, just no way to switch

---

## Suggested sequence

1. **Phase 1** — foundation refactors, ~half a day, makes everything after easier
2. **Phase 2** — blocking engine, the core product work
3. **Phase 3** — rules enforcement, builds on the engine
4. **Phase 4** — UI consistency, shared components
5. **Phase 5** — password hardening, can be done anytime
6. **Phase 6** — nav gating and polish, do last before any release

Phases 4 and 5 are independent and can be done in either order or in parallel. Phase 3 depends on Phase 2 being done.
