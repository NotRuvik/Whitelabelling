# Night Bright API Documentation

**Version:** 1.0
**Last Updated:** June 24, 2025

This document outlines the available API endpoints for the Night Bright platform.

**Base URL:** `http://localhost:5000/api/v1`

**Authentication:** Most endpoints are protected and require a `Bearer Token` in the `Authorization` header. The token is obtained from the `/auth/login` endpoint.

`Authorization: Bearer <YOUR_JWT_TOKEN_HERE>`

---

## 1. Public Endpoints (No Auth Required)

These endpoints are accessible to anyone.

### List Active Plans
Returns a list of all subscription plans where `isActive: true`.

- **Endpoint:** `GET /plans`

### Get a Single Active Plan
Returns the details of a single plan, only if it is active.

- **Endpoint:** `GET /plans/:planId`
- **URL Parameter:**
  - `planId` (string): The `_id` of the plan.

---

## 2. Authentication Endpoints (`/auth`)

Endpoints for user registration and login.

### Register New Organization
Creates a new Organization (tenant), the first admin user, and starts a recurring Stripe subscription.

- **Endpoint:** `POST /auth/register`
- **Access:** Public

**Body Parameters:**

| Parameter | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `name` | String | The legal name of the NPO. | Yes |
| `firstName` | String | First name of the primary admin. | Yes |
| `lastName` | String | Last name of the primary admin. | Yes |
| `email` | String | The admin's email (used for login). | Yes |
| `password` | String | The admin's password (min 8 characters). | Yes |
| `domainSlug`| String | Unique slug for their subdomain. | Yes |
| `planType` | String | The chosen plan name (`starter`, `standard`, `premium`). | Yes |
| `paymentMethodId` | String | A valid `pm_...` token from Stripe. | Yes |

### User Login
Authenticates any type of user (`super_admin`, `npo_admin`, etc.) and returns a JWT.

- **Endpoint:** `POST /auth/login`
- **Access:** Public

**Body Parameters:**

| Parameter | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `email` | String | The user's registered email. | Yes |
| `password` | String | The user's password. | Yes |

---

## 3. Administrative Endpoints

All endpoints in this section require **Super Admin** authentication.

### User Management (`/users`)

#### Create a User
Creates any type of user (including other Super Admins or NPO Admins manually).

- **Endpoint:** `POST /users`
- **Body:** `{ "firstName": "...", "lastName": "...", "email": "...", "password": "...", "role": "super_admin" }`

### Plan Management (`/plans`)

#### Create a Plan
- **Endpoint:** `POST /plans`
- **Body:** `{ "name": "premium", "priceInCents": 8333, "stripePriceId": "price_..." }`

#### List All Plans (Admin View)
- **Endpoint:** `GET /plans/all`

#### Update a Plan
- **Endpoint:** `PATCH /plans/:planId`
- **URL Parameter:** `planId` - The `_id` of the plan to update.
- **Body:** `{ "priceInCents": 9999, "isActive": false }` (any field is optional)

#### Deactivate a Plan (Soft Delete)
- **Endpoint:** `DELETE /plans/:planId`
- **URL Parameter:** `planId` - The `_id` of the plan to deactivate.

### Testing Tools (`/test-tools`)

#### Generate Test Payment Method ID
Creates a fresh, valid, un-owned `paymentMethodId` for use in testing.

- **Endpoint:** `POST /test-tools/generate-pm`
- **Access:** Super Admin only
- **Body:** None

---

## 4. NPO (Tenant) Endpoints

These endpoints require authentication as a user belonging to an organization.

### Missionary Management (`/missionaries`)

#### Create a Missionary
- **Endpoint:** `POST /missionaries`
- **Access:** NPO Admin only
- **Body:** `{ "userId": "...", "bio": "...", "country": "..." }`

#### List Missionaries for My Organization
- **Endpoint:** `GET /missionaries`
- **Access:** NPO Admin, Missionary

#### Get a Single Missionary
- **Endpoint:** `GET /missionaries/:missionaryId`
- **Access:** NPO Admin, Missionary
- **URL Parameter:** `missionaryId` - The `_id` of the missionary.

#### Update a Missionary
- **Endpoint:** `PATCH /missionaries/:missionaryId`
- **Access:** NPO Admin only
- **URL Parameter:** `missionaryId` - The `_id` of the missionary.
- **Body:** `{ "bio": "An updated bio.", "country": "New Country" }` (any field is optional)

#### Deactivate a Missionary (Soft Delete)
- **Endpoint:** `DELETE /missionaries/:missionaryId`
- **Access:** NPO Admin only
- **URL Parameter:** `missionaryId` - The `_id` of the missionary to deactivate.

### Cause Management (`/causes`)

#### Create a Cause
- **Endpoint:** `POST /causes`
- **Access:** NPO Admin only
- **Body:** `{ "name": "...", "goalAmount": 5000, "missionaryId": "..." }`

#### List Causes for My Organization
- **Endpoint:** `GET /causes`
- **Access:** NPO Admin, Missionary

#### Get a Single Cause
- **Endpoint:** `GET /causes/:causeId`
- **Access:** NPO Admin, Missionary
- **URL Parameter:** `causeId` - The `_id` of the cause.

#### Update a Cause
- **Endpoint:** `PATCH /causes/:causeId`
- **Access:** NPO Admin only
- **URL Parameter:** `causeId` - The `_id` of the cause.
- **Body:** `{ "name": "Updated Cause Name", "goalAmount": 7500 }` (any field is optional)

#### Delete a Cause
- **Endpoint:** `DELETE /causes/:causeId`
- **Access:** NPO Admin only
- **URL Parameter:** `causeId` - The `_id` of the cause to delete.