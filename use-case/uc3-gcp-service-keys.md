# Use-Case: Management of GCP Service Account Keys

**Objective:** Onboard JSON key files for GCP Service Accounts into the Delinea Platform. Securely store and manage over-privileged service account keys that are often scattered in code and config files, ensuring keys are retrieved through PAM without exposing the underlying JSON.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine and Distributed Engine installed and active
- GCP project with service accounts and JSON key files
- GCP user account with permissions to create service accounts and keys
- Basic folder structure created (create `GCP` folder)

**Estimated Time:** 45-60 minutes

---

## Step 1: Create Folder Structure for GCP Accounts

1. Log in to Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Secret Server → All Secrets**
3. Click **New Folder**
4. Create folder:
   - Folder name: `GCP`
   - Parent folder: Root level
   - Click **Create**

---

## Step 2: Create GCP Service Account for Discovery (Optional)

*Skip this step if you only want to manually upload existing service account keys. Complete this if you want automated discovery of GCP service accounts.*

### 2.1: Create Service Account in GCP Console

1. Log in to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **IAM & Admin → Service Accounts**
4. Click **Create Service Account**
5. Configure:
   - **Service account name:** `delinea-discovery-svc`
   - **Service account ID:** `delinea-discovery-svc` (auto-populated)
   - **Description:** `Service account for Delinea Platform discovery`
6. Click **Create and Continue**
7. Grant roles:
   - Click **Select a role**
   - Search for and select: **Service Account Viewer**
   - Click **Add Another Role**
   - Search for and select: **Project Viewer**
8. Click **Continue**
9. Skip "Grant users access" (optional)
10. Click **Done**

### 2.2: Generate JSON Key for Discovery Account

1. In the service accounts list, find `delinea-discovery-svc`
2. Click the three dots (⋮) → **Manage keys**
3. Click **Add Key → Create new key**
4. Select key type: **JSON**
5. Click **Create**
6. The JSON key file downloads automatically
7. Save this file securely (you'll upload it in Step 3)

---

## Step 3: Store GCP Service Account Keys in Platform

### 3.1: Upload Discovery Service Account Key

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `/GCP`
3. Click **Create Secret**
4. Select template: **Google IAM Service Account Key**
5. Configure:
   - **Folder:** `/GCP`
   - **Secret Name:** `GCP Discovery Service Account - [Project-ID]`
   - **Service Account Email:** Copy from JSON file (`client_email` field)
   - **Private Key ID:** Copy from JSON file (`private_key_id` field)
   - **Project ID:** Your GCP project ID
   - **JSON Private Key:** Click **Upload File**
     - Select the JSON key file downloaded in Step 2.2
     - File uploads and populates the field
   - **Notes:** "Discovery service account for GCP"
6. Click **Create Secret**

### 3.2: Upload Application Service Account Keys

For each existing GCP service account key you want to manage:

1. Click **Create Secret** in `/GCP` folder
2. Select template: **Google IAM Service Account Key**
3. Configure:
   - **Secret Name:** `GCP SA - [service-account-name] - [Project-ID]`
   - **Service Account Email:** From JSON file (`client_email`)
   - **Private Key ID:** From JSON file (`private_key_id`)
   - **Project ID:** Your GCP project ID
   - **JSON Private Key:** Upload the JSON key file
   - **Notes:** Describe the service account purpose (e.g., "Production API service account")
4. Click **Create Secret**
5. Repeat for all service account keys you need to manage

---

## Step 4: Configure Remote Password Changing (RPC) for Key Rotation

### 4.1: Grant Key Admin Permissions to Discovery Account

1. Return to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **IAM & Admin → IAM**
3. Click **Grant Access**
4. Configure:
   - **New principals:** `delinea-discovery-svc@[project-id].iam.gserviceaccount.com`
   - **Select a role:** Search for and select **Service Account Key Admin**
5. Click **Save**

### 4.2: Enable Remote Password Changing

1. In Delinea Platform, navigate to **Settings → Administration**
2. Search for and click **Remote Password Changing**
3. Click **Edit**
4. Verify enabled:
   - **☑ Enable Remote Password Changing**
   - **☑ Enable Heartbeat**
5. Click **Save**

### 4.3: Configure RPC for Service Account Secret

1. Navigate to one of your GCP service account secrets
2. Click **Remote Password Changing** tab
3. Click **Edit**
4. Configure:
   - **☑ Enable Auto Change**
   - **Auto Change Schedule:** Select schedule (e.g., `90 Days`)
   - **Change password using:** Privileged Account
   - **Privileged Account:** Select `GCP Discovery Service Account - [Project-ID]`
5. Click **Save**
6. Repeat for other service account secrets as needed

### 4.4: Test Password Rotation

1. With a service account secret open, click **Remote Password Changing** tab
2. Click **Change Password Now** (manual test)
3. Click **Confirm**
4. Wait 30-60 seconds for rotation to complete
5. Click **Refresh** to see updated status
6. Verify:
   - Last password change timestamp updated
   - New Private Key ID generated
   - Status shows "Success"

---

## Step 5: Configure GCP Discovery Source (Optional)

*Complete this section to enable automated discovery of GCP service accounts*

### 5.1: Enable API Access in GCP

1. In Google Cloud Console, navigate to **APIs & Services → Library**
2. Search for: **Identity and Access Management (IAM) API**
3. Click on the API
4. Click **Enable** (if not already enabled)
5. Repeat for: **Cloud Resource Manager API**

### 5.2: Create Discovery Source

1. In Delinea Platform, navigate to **Discovery → Sources**
2. Click **Create Source**
3. In **Discovery type**, select **Vault**
4. Select **Google Cloud Platform (GCP)**
5. Click **Continue**
6. Configure source:
   - **Discovery Source Name:** `GCP Service Accounts - [Project-Name]`
   - **Description:** `Discovery of GCP service accounts for [project]`
   - **State:** Enabled
   - **Project ID:** Your GCP project ID
   - **Discovery Secret:** Select `GCP Discovery Service Account - [Project-ID]`
   - **Discovery Site:** Select your site
7. Click **Save**

### 5.3: Configure Discovery Scanners

1. On the **Add discovery scanners** page:
   - ☑ GCP Service Account Scanner
2. Click **Save**

### 5.4: Run Discovery Scan

1. Navigate to **Discovery → Sources**
2. Find your source: `GCP Service Accounts - [Project-Name]`
3. Click the three dots (⋮) → **Run Discovery Scan**
4. Click **Run Now**
5. Wait 5-10 minutes for completion
6. Navigate to **Discovery → Network View → Accounts** tab
7. Filter by source to see discovered GCP service accounts
8. Select accounts and click **Import** to add to vault

---

## Step 6: Configure Secure Access to Service Account Keys

### 6.1: Set Access Restrictions

1. Navigate to a GCP service account secret
2. Click **Security** tab
3. Click **Edit**
4. Configure security settings:
   - **☑ Require comment** (forces documentation of usage)
   - **☑ Require approval for access** (optional - select workflow if needed)
   - **☑ Check out** (enables exclusive access)
     - **Check out interval:** `1 hour`
     - **☑ Change password on check in**
   - **☑ Hide launcher password** (prevents viewing raw JSON)
5. Click **Save**

### 6.2: Configure Launcher for Applications

1. Still in the secret, click **Settings** tab
2. Scroll to **Launcher Settings**
3. Click **Edit**
4. Configure:
   - **Default launcher:** None (forces API/script access only)
   - **☑ Allow web launcher** (uncheck to prevent browser viewing)
5. Click **Save**

---

## Step 7: Integrate Service Account Access with Applications

### 7.1: Configure API Access for Applications

1. Navigate to **Settings → Administration**
2. Search for **API**
3. Note the API endpoint URL: `https://[tenant].delinea.app/api/v1`
4. Document for application teams:
   - API Endpoint
   - Secret ID (from secret URL)
   - Required permissions

### 7.2: Create Application User for API Access

1. Navigate to **Access → Users**
2. Click **Add Local User**
3. Configure:
   - **Username:** `app-[application-name]`
   - **Display name:** `Application - [Application Name]`
   - **Email:** Application team email
4. Click **Next**
5. Select **Membership type: Application**
6. Click **Next**
7. Assign to appropriate group with API access
8. Click **Add**

### 7.3: Grant Application Access to Secrets

1. Navigate to the GCP service account secret
2. Click **Security** tab
3. Click **Edit Permissions**
4. Click **Add**
5. Configure:
   - **User/Group:** Select application user created above
   - **Role:** Viewer (or custom role with View permission)
6. Click **Save**

### 7.4: Generate API Token for Application

1. Log in as the application user (or have admin generate)
2. Navigate to user profile
3. Click **API Keys**
4. Click **Generate New Key**
5. Configure:
   - **Key Name:** `[Application-Name] Production Key`
   - **Expiration:** 1 year (or per security policy)
6. Click **Generate**
7. **IMPORTANT:** Copy the API token immediately (shown only once)
8. Provide to application team securely

---

## Step 8: Test Service Account Key Retrieval

### 8.1: Test API Access (Using curl)

Create a test script to retrieve the service account key:

```bash
#!/bin/bash

# Configuration
PLATFORM_URL="https://[tenant].delinea.app"
API_TOKEN="your-api-token"
SECRET_ID="123"  # Replace with your secret ID

# Retrieve secret
curl -X GET \
  "${PLATFORM_URL}/api/v1/secrets/${SECRET_ID}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json"
```

### 8.2: Test Key Extraction (Python Example)

```python
import requests
import json

# Configuration
platform_url = "https://[tenant].delinea.app"
api_token = "your-api-token"
secret_id = 123

# Headers
headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json"
}

# Get secret
response = requests.get(
    f"{platform_url}/api/v1/secrets/{secret_id}",
    headers=headers
)

if response.status_code == 200:
    secret_data = response.json()
    
    # Extract service account key
    json_key = secret_data['items'][0]['itemValue']
    
    # Parse as JSON
    key_data = json.loads(json_key)
    
    # Use key data
    print(f"Service Account: {key_data['client_email']}")
    print(f"Project: {key_data['project_id']}")
    
    # Key is now available for GCP SDK authentication
else:
    print(f"Error: {response.status_code}")
```

### 8.3: Verify Key Works with GCP

Test the retrieved key with gcloud CLI:

```bash
# Save retrieved JSON to file
echo '[json-content]' > /tmp/gcp-key.json

# Activate service account
gcloud auth activate-service-account \
  --key-file=/tmp/gcp-key.json

# Test authentication
gcloud projects list

# Cleanup
rm /tmp/gcp-key.json
```

---

## Step 9: Configure Audit and Monitoring

### 9.1: Enable API Audit Logging

1. Navigate to **Settings → Administration**
2. Search for **Audit**
3. Click **Edit**
4. Verify enabled:
   - **☑ Enable audit logging**
   - **☑ Log API access**
   - **☑ Log secret access**
5. Click **Save**

### 9.2: Create Alert for Key Access

1. Navigate to **Settings → Administration**
2. Search for **Event Subscriptions**
3. Click **Create Subscription**
4. Configure:
   - **Subscription Name:** `GCP Service Account Key Access Alert`
   - **Event Type:** Secret View
   - **Filter by folder:** `/GCP`
   - **Alert method:** Email
   - **Recipients:** Security team email
5. Click **Save**

### 9.3: Review Access Logs

1. Navigate to **Insights → Reports**
2. Run report: **Secret Access Audit**
3. Filter by:
   - Folder: `/GCP`
   - Date range: Last 30 days
4. Review:
   - Who accessed keys
   - When access occurred
   - Which applications retrieved keys
   - Any failed access attempts

---

## Step 10: Document Key Management Procedures

### 10.1: Create Key Rotation Documentation

Document the following for your team:

**Service Account Key Inventory:**
- List all service accounts managed in Platform
- Document purpose and applications using each key
- Note rotation schedule for each key

**Key Rotation Procedure:**
1. Automatic rotation occurs every 90 days via RPC
2. Monitor rotation success in audit logs
3. Verify applications continue functioning after rotation
4. Escalate rotation failures to security team

**Emergency Key Rotation:**
1. Navigate to service account secret
2. Click **Remote Password Changing** tab
3. Click **Change Password Now**
4. Notify application teams of immediate rotation
5. Update applications with new key within 1 hour

### 10.2: Create Application Integration Guide

Provide to development teams:

**Accessing GCP Service Account Keys:**
1. Request access to specific service account secret
2. Obtain API token from Platform administrator
3. Use Platform API to retrieve key at runtime
4. Never store key in code or config files
5. Retrieve fresh key on application restart
6. Handle key rotation automatically (keys rotate every 90 days)

**Sample Code References:**
- Python: [Link to Step 8.2 example]
- Bash: [Link to Step 8.1 example]
- Node.js: [Provide if needed]

---

## Success Criteria Verification

- ✅ GCP service account JSON keys uploaded to Platform vault
- ✅ Service account keys stored with proper metadata (email, project ID, private key ID)
- ✅ Keys organized in appropriate folder structure
- ✅ Remote Password Changing configured with privileged account
- ✅ Automatic key rotation schedule configured (90 days)
- ✅ Manual rotation tested successfully
- ✅ New key generated and old key deleted in GCP
- ✅ Discovery service account created with Key Admin permissions
- ✅ GCP discovery source configured (if using automated discovery)
- ✅ Application API access configured and tested
- ✅ Service account key retrieved via REST API successfully
- ✅ Retrieved key tested with gcloud CLI authentication
- ✅ Underlying JSON never exposed to end users
- ✅ Audit logging enabled for all key access
- ✅ Access alerts configured for security team
- ✅ Key rotation and access procedures documented

---