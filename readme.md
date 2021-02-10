# Tech Overview

- Deployment perspective:
-- Docker compose
-- Git CI / CD 
-- monorepo
- Technical
-- headless API
 -- NodeJS + TypeScript + typescript-rest
-- DB
 -- Postgres
 -- TypeORM 
-- models
 --  entities / db structure
 -- super-basic business logic
 -- DTO
-- crawler 
 -- Bull queue manager between API as orchestrator and crawlers -> redis 
 -- HTML - puppeteer emulator
 - manual import: 
 -- 1. "take" the raw data 
 -- 2. transforms to CSV 
 -- 3. CSV to internal db structures
 -- 4. Calculations 
-- frontend:
 --  NextJS application (with React)
 -- "public part" separate from "backoffices / admin" (?)
 -- MobX for data storage
 -- UI is based on Argon template from CreativeTim
# Setup

1. `yarn` in root folder (Lerna handles different yarns inside packages)
2. Locally, need to have Postgres and Redis (on port 6379)
3. Run api: `cd api; yarn swagger; yarn dev`
4. Run seed `yarn seed:run`
5. Run crawlers `yarn start`
6. Run frontend (next): `yarn dev`

# Deployment
TBD
