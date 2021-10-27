# COVID-19 Memorial Sri Lanka Data Source

This repository contains software for compiling and aiding documentation of victims of COVID-19 in Sri Lanka.

## Datasets

| Name | Type | Latest URL |
| --- | --- | --- |
| COVID-19 Deaths Dataset | Manually Processed | [JSON](https://raw.githubusercontent.com/sl-c19-memorial/memorial-dataset/data/data/covid19_deaths_latest.json)
| Geo Dataset | Manually Processed | [JSON](https://raw.githubusercontent.com/sl-c19-memorial/memorial-dataset/data/data/geo_processed_latest.json)

## Local Setup
Pre-requisites
- NodeJS
- Yarn Package Manager.
- Git

After cloning repository, 
```
yarn install
yarn scrape
```
### Configuration
These environment variables should be set for full functionality.
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=<saccount>
GOOGLE_PRIVATE_KEY=<pkey>
GOOGLE_SHEET_ID=<sheedId>
GOOGLE_GEO_SHEET_ID=<geoSheetId>
```
## Licence

```
 The MIT License (MIT)
 Copyright (c) 2021 Kaveen Rodrigo
```
full terms available in `LICENCE` file in repository.
