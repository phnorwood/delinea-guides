# Use-Case: Retrieve a Secret Value via REST API

**Objective:** Authenticate to the Delinea Platform REST API, search for a secret by name, inspect its fields, and retrieve a specific field value using curl.

**Prerequisites:**
- Delinea Platform cloud tenant
- User account with API access and View permission on the target secret
- `curl` and `jq` installed on your workstation

**Estimated Time:** 15 minutes

---

## Step 1: Authenticate and Get a Bearer Token

```bash
TOKEN=$(curl -s -X POST \
  "https://<tenant>.secretservercloud.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=$SS_USER&password=$SS_PASS" \
  | jq -r '.access_token')
```

> Store credentials in environment variables (`SS_USER`, `SS_PASS`). Never hardcode them in scripts.

---

## Step 2: Search for the Secret by Name

```bash
curl -s -X GET \
  "https://<tenant>.secretservercloud.com/api/v1/secrets?filter.searchText=my-secret-name&take=10" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.records[] | {id, name, secretTemplateName, folderId}'
```

Note the `id` from the response — you need it for the next steps.

---

## Step 3: Inspect Available Fields

```bash
curl -s -X GET \
  "https://<tenant>.secretservercloud.com/api/v1/secrets/42" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.items[] | {fieldName, slug}'
```

The `slug` is the field identifier used to retrieve a specific value. Common slugs: `password`, `username`, `private-key`, `notes`.

---

## Step 4: Retrieve the Field Value

```bash
curl -s -X GET \
  "https://<tenant>.secretservercloud.com/api/v1/secrets/42/fields/password" \
  -H "Authorization: Bearer $TOKEN"
```

The response is a plain string (not JSON):

```
P@ssw0rd!SuperSecret
```

---

## Complete Script

```bash
#!/bin/bash
# Usage: SS_USER=myuser SS_PASS=mypass ./get-secret.sh "my-secret-name"

TENANT="<tenant>.secretservercloud.com"
SEARCH_TERM="${1:?Usage: $0 <secret-name>}"

# Authenticate
TOKEN=$(curl -s -X POST \
  "https://$TENANT/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=$SS_USER&password=$SS_PASS" \
  | jq -r '.access_token')

[[ -z "$TOKEN" || "$TOKEN" == "null" ]] && { echo "Auth failed"; exit 1; }

# Search for the secret
SECRET_ID=$(curl -s -X GET \
  "https://$TENANT/api/v1/secrets?filter.searchText=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$SEARCH_TERM")&take=1" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.records[0].id')

[[ -z "$SECRET_ID" || "$SECRET_ID" == "null" ]] && { echo "Secret not found"; exit 1; }

echo "Found Secret ID: $SECRET_ID"

# Inspect fields
echo "Available fields:"
curl -s -X GET \
  "https://$TENANT/api/v1/secrets/$SECRET_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.items[] | {fieldName, slug}'

# Retrieve the password field
echo -e "\nPassword value:"
curl -s -X GET \
  "https://$TENANT/api/v1/secrets/$SECRET_ID/fields/password" \
  -H "Authorization: Bearer $TOKEN"
echo
```

---

## Troubleshooting

| Error | Likely Cause |
|---|---|
| `401 Unauthorized` | Token expired, wrong credentials, or account locked |
| `403 Forbidden` | User lacks View permission on the secret |
| `404 Not Found` | Wrong secret ID, field slug, or base URL |
| Empty search results | Try a shorter or broader search term |

---

## Success Criteria Verification

- ✅ Bearer token obtained via `/oauth2/token`
- ✅ Secret located by name using search
- ✅ Available fields listed with correct slugs
- ✅ Target field value retrieved successfully
- ✅ No credentials hardcoded in script
