# LitePruner Vulnerability Dashboard

This project is a Next.js security report dashboard for the LitePruner API audit. It presents the existing vulnerability findings, recommendations, severity metrics, and token-drain visualization in a polished light-themed dashboard layout.

The report content is intentionally preserved. Findings text, recommendation text, metrics, and footer copy are rendered from the existing content structure without rewriting or summarizing the underlying audit details.

## Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Chart.js

## Project Structure

- `app/page.tsx`: Main dashboard page and layout composition
- `app/globals.css`: Global theme tokens and light dashboard styling
- `components/findings-data.ts`: Source of record for findings and severity metadata
- `components/SeverityChart.tsx`: Severity distribution chart
- `components/TokenDrainBar.tsx`: Token-drain / controlled exhaustion visualization

## Local Development

Install dependencies if needed:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) after starting the app locally.

## Dashboard Notes

- Light-theme only UI
- Larger typography and stronger visual hierarchy
- Card-based report presentation with improved spacing
- Severity visualization for findings data
- Token-drain visualization for the controlled exhaustion test
- Responsive layout for desktop and mobile

## Content Preservation

The dashboard is designed to improve presentation only. It keeps the same findings data and the same report sections while enhancing layout, typography, charting, and visual consistency.

## Verification

The production build has been verified successfully with:

```bash
npm run build
```
