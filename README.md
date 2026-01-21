# TagHider – Codeforces Practice Mode

TagHider is a Chrome extension for Codeforces that hides problem tags so you can practice without spoilers.  
The goal is simple: **solve first, classify later**.

If you’re training for contests, seeing tags like `dp`, `greedy`, or `graphs` upfront kills the exercise. This extension removes that bias.

---

## What it does

- Hides problem tags on Codeforces problem pages
- One-click toggle to show / hide tags
- Remembers your choice per problem
- Works on contest, problemset, and gym problems
- Inactive outside problem pages

No accounts. No tracking. No noise.

---

## Why this exists

In real contests:
- You don’t get tags
- You don’t know the intended solution
- You must reason from constraints and examples

Most people practice while subconsciously guided by tags.  
TagHider forces you to actually think.

---

## Installation (manual)

Until it’s published on the Chrome Web Store:

1. Clone or download this repository
2. Open Chrome and go to:
chrome://extensions/

3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the extension directory

The extension icon should appear in your toolbar.

---

## Usage

1. Open any Codeforces problem:
https://codeforces.com/problemset/problem/1/A


2. Tags are hidden automatically.

3. A placeholder appears where tags normally are.

4. To toggle visibility:
- Click the extension icon
- Use the toggle button

The state is saved **per problem**.

---

## Supported pages

- `codeforces.com/problemset/problem/*/*`
- `codeforces.com/contest/*/problem/*`
- `codeforces.com/gym/*/problem/*`

If you’re not on a problem page, the extension does nothing.

---

## How it works

- Content script locates the tag container using multiple selectors
- Tags are replaced with a placeholder element
- State is stored using `chrome.storage`
- Popup communicates with the content script via message passing
- No external requests, no injected frameworks

Designed to be simple and resilient to minor Codeforces layout changes.

---

## File structure

taghider/
├── manifest.json
├── content.js
├── popup.html
├── popup.css
├── popup.js
├── background.js
├── icons/
└── README.md


---

## Permissions

- `activeTab` – interact with the current page
- `storage` – persist tag visibility state
- `host_permissions` – access Codeforces pages

Nothing more.

---

## Known limitations

- Major DOM changes on Codeforces may require selector updates
- Tags loaded dynamically may briefly flash (rare)
- Chrome-only for now

---

## Contributing

If you find:
- a page where tags aren’t hidden
- broken selectors
- unnecessary complexity

Open an issue or submit a PR. Keep it minimal.

---

## License

Open source. Use it, fork it, modify it.

---

## Practice tip

Hide tags.  
Read constraints.  
Derive the solution.  
Check the tags only after.

That’s the whole point.