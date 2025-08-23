# E2E Testing with Playwright

This directory contains end-to-end tests for the portfolio application using [Playwright](https://playwright.dev/).

## Test Structure

### Test Files

- **`setup.spec.js`** - Basic infrastructure validation and smoke tests
- **`portfolio.spec.js`** - Main portfolio page navigation and sections
- **`terminal.spec.js`** - Terminal interface interactions on the landing page
- **`admin.spec.js`** - Admin login functionality and form handling
- **`responsive.spec.js`** - Mobile responsiveness and fallback behavior

### Coverage

The E2E tests cover:

- ✅ Page loading and title verification
- ✅ Navigation between portfolio sections
- ✅ Terminal command interactions (help, start)
- ✅ Admin login form (success/failure scenarios)
- ✅ Mobile fallback behavior
- ✅ API call interception and mocking
- ✅ Responsive design across viewports
- ✅ Form validation and user interactions

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Interactive Mode with UI
```bash
npm run test:e2e:ui
```

### View Test Reports
```bash
npm run test:e2e:report
```

### Single Test File
```bash
npx playwright test e2e/portfolio.spec.js
```

### Debug Mode
```bash
npx playwright test --debug
```

## Test Configuration

The tests are configured via `playwright.config.js`:

- **Base URL**: `http://localhost:8000` (preview server)
- **Browsers**: Chrome (desktop and mobile viewports)
- **Web Server**: Automatically starts build + preview before tests
- **Screenshots**: Captured on failure
- **Traces**: Collected for debugging failed tests

## Architecture Notes

### Mobile vs Desktop Detection

The application shows different content based on:
- Window width (`> 800px` for desktop)
- Touch device detection (`"ontouchstart" in window`)

Tests handle this by:
- Setting appropriate viewport sizes
- Mocking window properties when needed
- Using conditional assertions based on detected content

### API Mocking

Tests mock API endpoints for:
- Admin login responses (success/failure)
- Data fetching (graceful handling of missing backend)

### Browser Support

Currently configured for Chrome browser due to sandboxed environment limitations. Can be extended to Firefox and Safari when browsers are available.

## Troubleshooting

### Test Failures

1. **Check Screenshots**: Failed tests generate screenshots in `test-results/`
2. **View Traces**: Use `npx playwright show-trace test-results/.../trace.zip`
3. **Debug Mode**: Run with `--debug` flag for step-by-step debugging

### Server Issues

If the web server fails to start:
1. Ensure `npm run build` works correctly
2. Check that port 8000 is available
3. Verify preview server starts with `npm run preview`

### Browser Issues

If browser automation fails:
- Try installing system dependencies: `npx playwright install-deps`
- Use system Chrome: Already configured via `channel: 'chrome'`