# TagHider - Quick Installation Guide

## 📦 What You Have

Your extension package includes:
- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.css` - Popup styling
- `popup.js` - Popup functionality
- `content.js` - Main script that hides tags on Codeforces
- `background.js` - Background service worker
- `icons/` - Extension icons (4 sizes)
- `README.md` - Full documentation
- `INSTALL.md` - This file

## 🚀 Installation Steps

### 1. Prepare the Files
Make sure all files are in one folder:
```
TagHider/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── content.js
├── background.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
└── INSTALL.md
```

### 2. Open Chrome Extensions Page
- Open Google Chrome
- Type `chrome://extensions/` in the address bar
- Press Enter

### 3. Enable Developer Mode
- Look for the "Developer mode" toggle in the top-right corner
- Click it to turn it ON
- You should see additional buttons appear

### 4. Load Your Extension
- Click the "Load unpacked" button
- Navigate to your TagHider folder
- Select the folder and click "Select Folder" (or "Open")
- The extension should now appear in your list!

### 5. Pin the Extension (Optional but Recommended)
- Click the puzzle piece icon (🧩) in Chrome's toolbar
- Find "TagHider - Codeforces Practice Mode"
- Click the pin icon (📌) next to it
- The extension icon will now appear in your toolbar

## ✅ Verify Installation

1. **Check the extension is enabled**
   - Go to `chrome://extensions/`
   - Find "TagHider - Codeforces Practice Mode"
   - Make sure the toggle is ON (blue)

2. **Test on Codeforces**
   - Go to any Codeforces problem: https://codeforces.com/problemset/problem/1/A
   - Tags should be automatically hidden
   - You should see a "🔒 Tags Hidden" badge

3. **Test the popup**
   - Click the extension icon in your toolbar
   - The popup should show "Tags are hidden" status
   - Click "Toggle Tag Visibility" to test

## 🎯 First Use

1. **Navigate to a problem**
   ```
   https://codeforces.com/problemset/problem/1/A
   ```

2. **Tags are hidden by default**
   - Look at the right sidebar
   - Tags section should be hidden
   - A blue badge shows "🔒 Tags Hidden"

3. **Toggle when needed**
   - Click the extension icon
   - Click "Toggle Tag Visibility"
   - Tags will smoothly appear/disappear

## 🐛 Troubleshooting

### Extension not showing up?
- Make sure you selected the correct folder
- Check that `manifest.json` is in the root of the folder
- Try reloading the extension: click the refresh icon (🔄) on the extension card

### Tags not hiding?
- Refresh the Codeforces page
- Make sure you're on a problem page (not homepage)
- Check the extension is enabled

### Popup not opening?
- Try reloading the extension
- Close and reopen Chrome
- Check for errors in `chrome://extensions/` (click "Errors" button)

### Still having issues?
1. Open DevTools: Press F12
2. Go to the Console tab
3. Look for any error messages
4. Check if "TagHider:" logs appear

## 📝 Quick Tips

✅ **DO:**
- Keep tags hidden while solving
- Only reveal tags if completely stuck
- Practice multiple problems daily
- Use the extension on all Codeforces problem pages

❌ **DON'T:**
- Look at tags immediately
- Disable the extension during practice
- Skip problems just because tags are hidden

## 🎓 Best Practices

1. **Start Fresh**: Always begin with tags hidden
2. **Think First**: Spend at least 5-10 minutes analyzing the problem
3. **Make Attempts**: Try your initial approach even if unsure
4. **Last Resort**: Only reveal tags after genuine attempts
5. **Learn**: After solving, check the tags to understand the category

## 🔄 Updating the Extension

If you make changes to the code:
1. Go to `chrome://extensions/`
2. Find TagHider
3. Click the refresh icon (🔄)
4. Test your changes

## 🗑️ Uninstalling

If you want to remove the extension:
1. Go to `chrome://extensions/`
2. Find "TagHider - Codeforces Practice Mode"
3. Click "Remove"
4. Confirm the removal

## 📞 Support

If you encounter any issues:
1. Check the README.md for detailed documentation
2. Look at the troubleshooting section above
3. Check the browser console for error messages
4. Make sure you're using the latest version of Chrome

## 🎉 You're All Set!

The extension is now ready to use. Happy coding and good luck with your practice! 🚀

---

**Remember**: The goal is to improve your problem-solving skills by:
- Developing pattern recognition
- Building algorithmic intuition  
- Simulating real contest conditions
- Avoiding category bias

**Focus • Train • Excel** 💪
