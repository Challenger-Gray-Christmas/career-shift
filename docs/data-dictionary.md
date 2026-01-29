# Career Shift Data Dictionary

**Purpose**: This document describes the flat file structure for ingesting Lightcast regional outlook data into a database.

**Last Updated**: January 2026

---

## Overview

This document covers the flat file data source:

| Source | Format | Description |
|--------|--------|-------------|
| **Regional Outlook** | Excel (.xls) | County-level job projections from Lightcast |


---

## Flat File Structure

### Regional Outlook (County-Level Projections)

**Source File**: `Customer Service Reps - Regional Outlook.xls` (in `/reference/`)

This Excel file contains county-level job projections for a specific occupation.

#### Raw File Format

The file uses a wide format with year columns:

| County FIPS | County Name | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 | 2027 | 2028 | 2029 | 2030 |
|-------------|-------------|------|------|------|------|------|------|------|------|------|------|------|
| 4013 | Maricopa, AZ | 68500 | 69200 | 69800 | 70000 | 70131 | 69500 | 69200 | 68900 | 68700 | 68600 | 68551 |

#### Target Database Schema

After ETL transformation, the data should be stored as:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `occupation_id` | string | SOC code (derived from filename or metadata) | `"43-4051"` |
| `county_fips` | string | FIPS county code | `"4013"` |
| `county_name` | string | County, State format | `"Maricopa, AZ"` |
| `year` | integer | Year of projection | `2024` |
| `jobs` | integer | Projected jobs for that year | `70131` |

**Derived Fields** (calculate during ETL or query time):
- `jobs_base_year`: Jobs in the earliest year (2020)
- `jobs_forecast_year`: Jobs in the latest year (2030)
- `percent_change`: ((jobs_2030 - jobs_2020) / jobs_2020) * 100

---

## ETL Requirements

### Transformation Steps

1. **Extract occupation ID**: Parse from filename convention (e.g., "Customer Service Reps" → SOC code `43-4051`)
2. **Unpivot year columns**: Convert wide format to long format (one row per county per year)
3. **Validate FIPS codes**: Ensure county FIPS codes are properly formatted (leading zeros preserved)
4. **Calculate metrics**: Compute percent change between base and forecast years

### Data Quality Checks

- Verify all county FIPS codes are valid US county identifiers
- Ensure job counts are non-negative integers
- Check for missing values in required fields
- Validate year range (currently 2020-2030)

---

## Usage Notes

- The reference Excel file contains approximately 3,195 county records
- App displays top 20 counties by current job count
- FIPS codes are standard US county identifiers (string type to preserve leading zeros)