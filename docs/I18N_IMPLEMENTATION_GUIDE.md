# Internationalization (i18n) Implementation Guide

## Overview

This guide provides a comprehensive approach to implementing internationalization in your Next.js application using `next-intl`, supporting multiple languages, RTL layouts, and locale-specific formatting.

## Supported Features

### 1. Text Translation
- **Library**: `next-intl`
- **Message Format**: ICU MessageFormat with pluralization support
- **Supported Locales**: English (en), Spanish (es), French (fr), Arabic (ar), Chinese (zh)

### 2. Date/Time Formatting
- **Native API**: `Intl.DateTimeFormat`
- **Relative Time**: `Intl.RelativeTimeFormat`
- **Timezone Support**: Locale-specific timezone configuration

### 3. Number Formatting
- **Numbers**: `Intl.NumberFormat`
- **Currency**: Locale-specific currency formatting
- **Pluralization**: ICU plural rules support

### 4. RTL Layout Support
- **RTL Locales**: Arabic, Hebrew, Persian, Urdu
- **CSS Classes**: Automatic RTL class application
- **Layout Direction**: Dynamic direction switching

## Implementation Strategy

### Phase 1: Core Setup
1. Install dependencies
2. Configure middleware for locale detection
3. Set up message files structure
4. Create utility functions

### Phase 2: Component Integration
1. Update layout with locale provider
2. Create reusable formatting components
3. Implement locale switcher
4. Add RTL support

### Phase 3: Content Migration
1. Extract hardcoded strings
2. Update existing components
3. Add locale-specific content
4. Test all locales

## Key Components

### LocaleSwitcher
- Dropdown interface for language selection
- Smooth transitions with Framer Motion
- Persistent locale preference

### RTLProvider
- Automatic direction detection
- CSS class management
- Document attribute updates

### FormattedText Components
- Date/time formatting
- Number/currency formatting
- Pluralization support
- Relative time display

## Best Practices

### 1. Message Organization
```json
{
  "namespace": {
    "key": "value",
    "nested": {
      "key": "value"
    }
  }
}
```

### 2. Pluralization
```json
{
  "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

### 3. RTL Styling
```css
.rtl .text-left { text-align: right; }
.rtl .ml-4 { margin-left: 0; margin-right: 1rem; }
```

### 4. Date Formatting
```typescript
const date = new Date()
const formatted = formatDate(date, locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
```

## Testing Strategy

### 1. Locale Switching
- Test navigation between locales
- Verify URL structure
- Check state persistence

### 2. RTL Layout
- Test Arabic/Hebrew layouts
- Verify component alignment
- Check animation directions

### 3. Formatting
- Test date/time in different locales
- Verify number formatting
- Check currency display

### 4. Content Validation
- Ensure all strings are translated
- Check for text overflow
- Verify context accuracy

## Performance Considerations

### 1. Bundle Splitting
- Locale-specific message loading
- Dynamic imports for large translations
- Tree shaking unused locales

### 2. Caching
- Static generation for locale routes
- CDN caching for message files
- Browser locale detection

### 3. Loading States
- Skeleton screens during locale switching
- Progressive enhancement
- Fallback content

## Deployment Checklist

- [ ] All message files are complete
- [ ] RTL styles are tested
- [ ] Locale detection works correctly
- [ ] SEO meta tags are localized
- [ ] Error pages are translated
- [ ] Form validation messages are localized
- [ ] Date/number formats are correct
- [ ] Currency symbols are appropriate

## Recommended Tools

### Translation Management
- **Crowdin**: Professional translation platform
- **Lokalise**: Developer-friendly translation tool
- **Phrase**: Collaborative translation platform

### Development Tools
- **i18n Ally**: VS Code extension for translation management
- **next-intl DevTools**: Browser extension for debugging
- **ICU Message Format**: Online message format tester

### Testing Tools
- **Playwright**: Multi-locale E2E testing
- **Jest**: Unit testing for i18n utilities
- **Storybook**: Component testing across locales

## Maintenance

### Regular Tasks
1. Update translation files
2. Add new locale support
3. Review RTL layouts
4. Update formatting rules
5. Monitor performance metrics

### Quality Assurance
1. Native speaker reviews
2. Cultural appropriateness checks
3. Technical accuracy validation
4. User experience testing
5. Accessibility compliance

This implementation provides a solid foundation for internationalization that can scale with your application's growth and support additional locales as needed.