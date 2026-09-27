# Up & Breathing

What to do after surgery — today.

Up & Breathing is a bedside coach for a hospitalized postoperative patient. It walks through sitting up, a short walk, ten slow breaths, a splinted cough, and mouth care. The plan changes with the surgery type and the hospital day.

This is patient education. It is not a medical device, not a diagnosis, not an electronic health record, and not a clinician dashboard. It does not replace nurses, doctors, or physical therapists. If the guide and the care team disagree, the team wins.

Do not market this as a treatment for pneumonia.

## Why there is no backend

The app stores nothing on a server. There are no accounts and no protected health information. It does not ask for a name, date of birth, medical record number, surgeon, hospital, photo, or free-text diagnosis. The surgery type, hospital day, checklist, breathing log, walk log, optional pain number, optional spirometer number, language, text size, and motion preference stay in `localStorage` on the phone. Export downloads a text file locally. Nothing is uploaded.

## Run it

```bash
npm i
npm run dev
```

Open the URL Vite prints. The dev server is for building. The installable app is the production build.

```bash
npm run build
npm run preview
```

`npm run build` typechecks, then writes a static site to `dist/`.

## Deploy

Upload `dist/` to any static host.

- Vercel: `vercel.json` rewrites unknown paths to `index.html` so routes like `/breathe` survive a refresh.
- Netlify: `public/_redirects` does the same and is copied into `dist/`.
- GitHub Pages: use a host that serves `index.html` for client-side routes, or set `base` in `vite.config.ts` if the site lives in a subpath.

The app is a progressive web app. The manifest name is Up & Breathing, the theme color is `#0F3D3E`, and the service worker caches the shell so the guide still opens after the first load. On an iPhone, use Share, then Add to Home Screen.

After the site has a public URL, open `/print`. That page is a one-page bedside flyer. It shows the live origin and a box labeled for a QR code. Paste a QR of that URL, print the page, and tape it up. The app does not generate the QR image.

## Add a surgery type

1. Add the id to `SurgeryId` and `SURGERY_IDS` in `src/data/types.ts`.
2. Add the patient-facing label, helper, and short label in `src/data/copy.ts` and the Spanish versions in `src/data/copy.es.ts`. Use usted in Spanish.
3. Add all four hospital days (`pacu`, `pod0`, `pod1`, `pod2`) in both languages in `src/data/protocols.ts`. Every field is a full sentence. Add the type-specific extra sentences too.
4. Do not claim the app prevents pneumonia, treats atelectasis, or replaces physical therapy. Say that it helps people practice the same habits hospitals use to support recovery. If the team’s instructions differ, the team’s instructions win.

## Safety rules baked in

Every walk screen tells the patient to ask a nurse before standing the first time, and any time they feel dizzy, short of breath, or unsteady. Recovery and the day of surgery also show a call-bell warning on the home screen. Pain numbers are optional, stored only on the device, and never scored.
