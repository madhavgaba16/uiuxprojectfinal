# 🔧 TROUBLESHOOTING & FAQ

## ❓ Common Questions

### Q: How do I access the application?
**A:** Open your browser and navigate to **http://localhost:3000**

### Q: Where is the PB11 validation?
**A:** On the Login Page, the vehicle number field checks if "PB11" is included. If not, you'll see an alert.

### Q: How do I see the chat feature?
**A:** 
1. Login to the app
2. Click "Account" in bottom navigation
3. Scroll to "Chat" section
4. Click "Open Demo Chat" button

### Q: How does the commission deduction work?
**A:** 
1. Open the demo chat in Account page
2. Click "Confirm Ride" button
3. Wait 500ms (simulating other driver confirmation)
4. A popup will appear showing "–₹50 Commission Deducted"
5. Popup auto-closes after 3 seconds

### Q: Where do I add dummy data?
**A:** Look for sections with text "Add dummy [type] here" in:
- Feed Page
- News Page
- Services Page
- Account Wallet
- Account Chat

### Q: Can I change the color scheme?
**A:** Yes! Edit the CSS files and change the color variables. Main colors are in each component's CSS file.

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 3000 Already in Use

**Symptom**: Error message saying port 3000 is already in use

**Solution**:
```powershell
# Option 1: Kill the process
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Option 2: Use a different port
$env:PORT=3001; npm start
```

---

### Issue 2: npm install fails

**Symptom**: Errors during dependency installation

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

---

### Issue 3: Blank Page After Login

**Symptom**: White/blank screen after clicking "Join Patiala Community"

**Solution**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify all components are imported in App.js
4. Clear browser cache and localStorage:
```javascript
// Run in browser console
localStorage.clear();
location.reload();
```

---

### Issue 4: Images Not Showing

**Symptom**: Uploaded images don't display

**Solution**:
- This is expected! File uploads create data URLs for preview
- Images are stored in browser memory, not on disk
- Backend integration needed for permanent storage

---

### Issue 5: Bottom Nav Not Showing

**Symptom**: Navigation bar missing at bottom

**Solution**:
1. Check if you're logged in (nav only shows after login)
2. Verify BottomNav.js is imported in App.js
3. Check CSS for `position: fixed` and `z-index: 1000`
4. Clear browser cache

---

### Issue 6: Routing Not Working

**Symptom**: Clicking navigation buttons doesn't change pages

**Solution**:
1. Ensure react-router-dom is installed:
```powershell
npm install react-router-dom
```
2. Check browser console for errors
3. Verify BrowserRouter wraps the App component
4. Check if basename is set correctly (should be "/" by default)

---

### Issue 7: Styles Not Applying

**Symptom**: Components look unstyled or broken

**Solution**:
1. Check if CSS files are imported in component files
2. Clear browser cache (Ctrl + Shift + Delete)
3. Hard refresh (Ctrl + Shift + R)
4. Check browser console for 404 errors on CSS files

---

### Issue 8: Can't Upload Files

**Symptom**: File upload button not working

**Solution**:
- Ensure you're clicking the styled label, not the hidden input
- Check browser console for errors
- Try different file types (JPG, PNG)
- Check file size (very large files may cause issues)

---

### Issue 9: Chat Confirmation Not Working

**Symptom**: Clicking "Confirm Ride" doesn't show popup

**Solution**:
1. Check if both confirmation states are handled
2. Open browser console to see any JavaScript errors
3. Verify the popup creation code in AccountPage.js
4. Check if popup CSS is loaded

---

### Issue 10: Responsive Design Broken

**Symptom**: Layout breaks on mobile/tablet

**Solution**:
1. Check viewport meta tag in index.html
2. Test with browser DevTools device emulation
3. Verify @media queries in CSS files
4. Check for fixed width elements
5. Clear cache and hard reload

---

## 🔍 Debugging Tips

### Check Browser Console
```
F12 → Console Tab
Look for:
- Red error messages
- Warning messages
- Network errors (404, 500)
- React error boundaries
```

### Check Network Tab
```
F12 → Network Tab
Look for:
- Failed resource loads
- 404 errors for CSS/JS files
- Slow loading resources
```

### Check React DevTools
```
Install React DevTools extension
F12 → React Tab
- Inspect component hierarchy
- Check props and state
- View component rerenders
```

### Check Application Storage
```
F12 → Application Tab → Local Storage
- Verify driverData is stored after login
- Check for corrupted data
- Clear if needed
```

---

## 🛠️ Development Mode Issues

### Hot Reload Not Working

**Symptom**: Changes don't reflect automatically

**Solution**:
1. Check if file is saved (Ctrl + S)
2. Restart development server
3. Check for syntax errors in console
4. Try hard refresh (Ctrl + Shift + R)

---

### Build Warnings

**Symptom**: Yellow warnings during npm start

**Solution**:
- Most warnings are from dependencies (safe to ignore)
- Focus on errors (red text) first
- Update dependencies if needed:
```powershell
npm update
```

---

## 📱 Browser-Specific Issues

### Chrome
- Works perfectly (recommended)
- No known issues

### Firefox
- Works well
- May need cache clear more often

### Safari
- Check for webkit-specific prefixes
- Some CSS features may need fallbacks

### Edge
- Works like Chrome (Chromium-based)
- No special considerations

---

## 🚀 Performance Issues

### Slow Page Load

**Solution**:
1. Check network speed
2. Clear browser cache
3. Close unnecessary tabs
4. Restart development server
5. Check for console errors

### Laggy Animations

**Solution**:
1. Check if GPU acceleration is enabled in browser
2. Reduce animation complexity
3. Check if many tabs are open
4. Close background applications

---

## 💾 Data Issues

### Login Data Not Persisting

**Symptom**: Need to login every time

**Solution**:
```javascript
// Check localStorage in console
localStorage.getItem('driverData')

// If null, login form didn't save
// Check LoginPage.js handleSubmit function
```

### Clear All Data

**To reset everything:**
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🔐 Security Warnings

### Mixed Content Warning

**If deploying with HTTPS:**
- Ensure all resources use HTTPS
- Update API endpoints to HTTPS
- Check for http:// links in code

---

## 📦 Build Issues

### Production Build Fails

**Solution**:
```powershell
# Clean build
Remove-Item -Recurse -Force build

# Try build again
npm run build

# If fails, check for:
# - Syntax errors
# - Missing imports
# - Environment variables
```

---

## 🎨 UI Issues

### Overlapping Elements

**Solution**:
1. Check z-index values
2. Verify position properties
3. Check for overflow issues
4. Inspect with DevTools

### Colors Look Different

**Solution**:
- Check monitor color profile
- Verify hex codes in CSS
- Check for browser color adjustments
- Test on multiple devices

### Fonts Not Loading

**Solution**:
1. Check internet connection (Google Fonts)
2. Verify link in index.html
3. Check font-family in CSS
4. Clear browser cache

---

## 🔄 Update/Reinstall

### Complete Fresh Install

```powershell
# Navigate to project
cd c:\Users\hp\OneDrive\Desktop\uiuxprojectfinal

# Delete everything except src and public
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install

# Start
npm start
```

---

## 📞 Getting Help

### Before Asking for Help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console
4. ✅ Try clearing cache
5. ✅ Test in incognito mode
6. ✅ Check README.md

### When Reporting Issues:

Include:
- Error message (full text)
- Browser and version
- Steps to reproduce
- Screenshots if relevant
- Console output

---

## 🎓 Learning Resources

### React
- [Official React Docs](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)

### React Router
- [React Router Docs](https://reactrouter.com/)
- [Navigation Guide](https://reactrouter.com/en/main/start/tutorial)

### CSS
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS-Tricks](https://css-tricks.com/)

### JavaScript
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

---

## 🔑 Quick Commands Reference

```powershell
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install dependencies
npm install

# Update dependencies
npm update

# Clear npm cache
npm cache clean --force

# Check npm version
npm --version

# Check node version
node --version

# Kill process on port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Clear terminal
Clear-Host
```

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm start`)
- [ ] Browser opened to localhost:3000
- [ ] No errors in browser console
- [ ] Internet connection active (for Google Fonts)
- [ ] Port 3000 not blocked by firewall
- [ ] Sufficient disk space
- [ ] Latest browser version

---

## 🎯 Still Having Issues?

1. **Read the README.md** - Comprehensive documentation
2. **Check QUICKSTART.md** - Step-by-step guide
3. **Review VISUAL_GUIDE.md** - Visual reference
4. **Check PROJECT_SUMMARY.md** - Project overview

---

**Most issues are solved by:**
1. Clearing browser cache
2. Restarting development server
3. Reinstalling dependencies
4. Checking console for errors

---

*Last Updated: November 2025*
