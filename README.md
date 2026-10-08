# Safe Lanka

Community disaster reporting and safety guidance for Sri Lanka. Reports are unverified observations, never official warnings. Posting does not contact emergency services.

## Features
- Report a hazard with district, landmark, description and observation time.
- Search and filter reports by district and disaster type.
- Expand each report to read sourced safety actions.
- View official DMC links and call DMC 117.
- Responsive design, validation, timestamps and clearly labelled fictional sample reports.

## Technology and architecture
React + Vite -> Express/Node API -> MongoDB Atlas via Mongoose.
`src/main.jsx` handles the interface and filters. `server/index.js` validates requests and stores reports. `server/shared.js` contains district names and sourced guidance. `server/dns.js` provides DNS resolution for Atlas on networks with DNS issues.

## Local setup
Run `npm ci`. Copy `server/.env.example` to `server/.env` and set your private MongoDB connection string. Run `npm run seed` for fictional examples. Run `npm start` for the API and production build, or `npm run server` for backend watch mode. In another terminal, run `npm run dev` and open http://127.0.0.1:5173. Run `npm run build` to build the frontend; Express then serves it on port 5000.

## Deploy on Render
1. Push the project to a GitHub repository without `.env`.
2. Create a Render Node web service from that repository, or use `render.yaml` as a blueprint.
3. Build command: `npm ci && npm run build`. Start command: `npm start`.
4. Add a secret `MONGODB_URI` environment variable. Render provides `PORT`.
5. Allow the hosting service's outbound IP addresses in Atlas Network Access.
6. Open the public URL in a private browser and test submission, filtering and guidance.

## Verification
Production build passed. API checks covered persistence, invalid district, short description, future observation time and protection of the demo-data flag. Test records were removed.

## Guidance sources
- DMC: https://www.dmc.gov.lk/index.php?lang=en
- DMC contact: https://www.dmc.gov.lk/index.php?id=1&lang=en&option=com_contact&view=contact
- Flood safety: https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/flood.html
- Tsunami safety: https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/tsunami.html
General guidance is static and not a live warning feed. Review sources before deployment.

## Two-minute demo
Introduce the local problem (20 seconds). Submit a fictional flood observation (40 seconds). Filter reports and expand suggested actions (40 seconds). Show the deployed URL, emergency contact and explain unverified-report labels (20 seconds).

## AI declaration
Codex generated and checked the implementation, sourced general safety guidance, and prepared deployment configuration. Team members must review and understand the submitted code. Write contribution statements yourselves.

## Submission items still required
Team details and contributions, actual GitHub/deployment/video links, exact significant AI prompts and checks in the AI Prompt Log, and the final submission PDF. These must reflect actual work.

## Prototype limitations
No authentication, moderation, photo uploads, automatic verification or live official-alert integration. Reports are public; do not submit private personal data. Demo reports remain explicitly labelled fictional. The list displays up to 500 newest reports. This project is not an emergency dispatch system.


## Database
Safe Lanka uses the separate MongoDB database safelanka and the disasterreports collection on the existing Atlas cluster. The earlier foodshare database is retained separately. The app and database rename does not rename the Atlas dashboard project or the local workspace directory.


## Removing incorrect reports
Each report has a Delete report button with a confirmation prompt. Confirming removes it from MongoDB and updates the visible list and counts. This prototype has no authentication: anyone with app access can delete reports. Before wider public use, restrict deletion to report owners or moderators.

