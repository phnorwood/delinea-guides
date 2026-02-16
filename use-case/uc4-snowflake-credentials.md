# Use-Case: Secure Storage of Snowflake User Passwords & Key Pair Authentication

**Objective:** Vault passwords for Snowflake users with ACCOUNTADMIN or SYSADMIN roles and securely store private keys used for key pair authentication. Check out credentials from the Platform, connect via SnowSQL or web UI, and validate that sessions are recorded and linked to specific users.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine with PRA workload installed and active
- Snowflake account with ACCOUNTADMIN or SYSADMIN access
- Snowflake user credentials (password or key pair) to vault
- Basic folder structure created (create `/Snowflake` folder)

**Estimated Time:** 45-60 minutes

---

## Step 1: Create Folder Structure for Snowflake Accounts

1. Log in to Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Secret Server → All Secrets**
3. Click **New Folder**
4. Create folder structure:
   ```
   Snowflake
   ├── Admin Accounts
   └── Service Accounts
   ```
   - Folder name: `Snowflake`
   - Parent folder: Root level
   - Click **Create**
5. Create subfolders:
   - `Admin Accounts` under `Snowflake`
   - `Service Accounts` under `Snowflake`

---

## Step 2: Create Secret Template for Snowflake Accounts

### 2.1: Create Template for Password Authentication

1. Navigate to **Settings → Administration**
2. Search for and click **Secret Templates**
3. Click **Create Template**
4. Configure:
   - **Template Name:** `Snowflake Account`
   - **Base Template:** Select **Web Password**
5. Click **Configure**
6. Add custom fields:
   - Click **Add Field**
     - **Field name:** `Account Identifier`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Warehouse`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Role`
     - **Field type:** Text
     - Click **Save**
7. Click **Save Template**

### 2.2: Create Template for Key Pair Authentication

1. Still in **Secret Templates**, click **Create Template**
2. Configure:
   - **Template Name:** `Snowflake Key Pair Account`
   - **Base Template:** Select **SSH Key**
3. Click **Configure**
4. Add custom fields:
   - Click **Add Field**
     - **Field name:** `Account Identifier`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Username`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Public Key Fingerprint`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Warehouse`
     - **Field type:** Text
     - Click **Save**
   - Click **Add Field**
     - **Field name:** `Role`
     - **Field type:** Text
     - Click **Save**
5. Click **Save Template**

---

## Step 3: Store Snowflake Password-Based Credentials

### 3.1: Create ACCOUNTADMIN Secret

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `/Snowflake/Admin Accounts`
3. Click **Create Secret**
4. Select template: **Snowflake Account**
5. Configure:
   - **Folder:** `/Snowflake/Admin Accounts`
   - **Secret Name:** `Snowflake ACCOUNTADMIN - [Account-Name]`
   - **URL:** `https://[account-identifier].snowflakecomputing.com`
   - **Username:** Your ACCOUNTADMIN username
   - **Password:** ACCOUNTADMIN password
   - **Account Identifier:** Your Snowflake account identifier (e.g., `xy12345.us-east-1`)
   - **Warehouse:** Default warehouse (e.g., `COMPUTE_WH`)
   - **Role:** `ACCOUNTADMIN`
   - **Notes:** "Primary administrative account for Snowflake"
6. Click **Create Secret**

### 3.2: Create SYSADMIN Secret

1. Click **Create Secret** in `/Snowflake/Admin Accounts` folder
2. Select template: **Snowflake Account**
3. Configure:
   - **Secret Name:** `Snowflake SYSADMIN - [Account-Name]`
   - **URL:** `https://[account-identifier].snowflakecomputing.com`
   - **Username:** Your SYSADMIN username
   - **Password:** SYSADMIN password
   - **Account Identifier:** Your Snowflake account identifier
   - **Warehouse:** Default warehouse
   - **Role:** `SYSADMIN`
   - **Notes:** "System administration account"
4. Click **Create Secret**

---

## Step 4: Configure Snowflake Key Pair Authentication

### 4.1: Generate RSA Key Pair (if not already created)

On your local machine or a secure workstation:

```bash
# Generate private key (encrypted with passphrase)
openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out snowflake_key.p8

# Generate public key
openssl rsa -in snowflake_key.p8 -pubout -out snowflake_key.pub

# Get public key fingerprint for storage
openssl rsa -pubin -in snowflake_key.pub -outform DER | openssl dgst -sha256 -binary | openssl enc -base64
```

Save the output fingerprint for later use.

### 4.2: Assign Public Key to Snowflake User

1. Log in to Snowflake using ACCOUNTADMIN
2. Run the following SQL to assign the public key:

```sql
-- Replace with your actual public key content (without header/footer)
ALTER USER [username] SET RSA_PUBLIC_KEY='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';
```

3. Verify key assignment:

```sql
DESC USER [username];
```

4. Look for `RSA_PUBLIC_KEY_FP` in the output (fingerprint)

### 4.3: Store Key Pair in Platform

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `/Snowflake/Admin Accounts`
3. Click **Create Secret**
4. Select template: **Snowflake Key Pair Account**
5. Configure:
   - **Folder:** `/Snowflake/Admin Accounts`
   - **Secret Name:** `Snowflake Key Pair - [Username] - [Account-Name]`
   - **Private Key:** Click **Upload File** and select `snowflake_key.p8`
     - Or paste the private key content directly
   - **Passphrase:** Enter the passphrase used when generating the key
   - **Username:** Snowflake username associated with the key pair
   - **Account Identifier:** Your Snowflake account identifier
   - **Public Key Fingerprint:** Paste the fingerprint from Step 4.1
   - **Warehouse:** Default warehouse
   - **Role:** The role for this user (e.g., `SYSADMIN`)
   - **Notes:** "Key pair authentication for Snowflake"
6. Click **Create Secret**

---

## Step 5: Configure Security Settings for Snowflake Secrets

### 5.1: Apply Access Controls

1. Open one of your Snowflake admin secrets
2. Click **Security** tab
3. Click **Edit**
4. Configure:
   - **☑ Require comment** (document reason for access)
   - **☑ Require approval for access** (optional - select workflow if needed)
   - **☑ Check out** (enables exclusive access)
     - **Check out interval:** `4 hours`
   - **☑ Session recording** (capture all activity)
   - **☑ Hide launcher password** (prevent password viewing)
5. Click **Save**
6. Repeat for all Snowflake admin secrets

---

## Step 6: Configure Privileged Remote Access for Snowflake Web UI

### 6.1: Configure Web Launcher

1. Open a Snowflake password-based secret
2. Click **Settings** tab
3. Find **Web Launcher** section
4. Click **Edit**
5. Configure:
   - **☑ Enable launcher**
   - **Launcher Type:** Web browser
   - **Launch URL:** Verify Snowflake URL is populated
6. Click **Save**

### 6.2: Enable Session Recording for Web Sessions

1. Navigate to **Settings → Administration**
2. Search for and click **Session Recording**
3. Click **Edit**
4. Verify:
   - **☑ Enable session recording**
   - **☑ Record web sessions**
   - **☑ Record keystrokes**
5. Click **Save**

---

## Step 7: Test Password-Based Authentication via Web UI

### 7.1: Access Snowflake via Platform

1. Navigate to your Snowflake password secret
2. Click **Open with Remote Access** (launcher button)
3. A new browser tab opens with PRA session
4. Verify:
   - Snowflake login page loads
   - Username is pre-filled (if using Web Password Filler)
   - Password is auto-filled
5. Click **Sign In**
6. Verify successful authentication to Snowflake

### 7.2: Perform Test Operations

Once logged in to Snowflake:

1. Click on **Worksheets**
2. Create a new worksheet
3. Run a test query:
   ```sql
   SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_WAREHOUSE();
   ```
4. Verify results show:
   - Your username
   - Expected role (ACCOUNTADMIN or SYSADMIN)
   - Default warehouse
5. Run additional test:
   ```sql
   SHOW DATABASES;
   ```
6. Verify you have appropriate access

### 7.3: End Session

1. Log out of Snowflake
2. Close the PRA browser tab
3. Return to Platform
4. The secret should automatically check in

---

## Step 8: Test Key Pair Authentication via SnowSQL

### 8.1: Install SnowSQL (if not already installed)

Download from: https://docs.snowflake.com/en/user-guide/snowsql-install-config.html

### 8.2: Retrieve Key from Platform

1. Navigate to your Snowflake key pair secret
2. Click **View** to display secret contents
3. Copy the **Private Key** content
4. Save to a temporary file: `/tmp/snowflake_key.p8`

```bash
# Save key to file
cat > /tmp/snowflake_key.p8 << 'EOF'
-----BEGIN ENCRYPTED PRIVATE KEY-----
[paste key content]
-----END ENCRYPTED PRIVATE KEY-----
EOF

# Set secure permissions
chmod 600 /tmp/snowflake_key.p8
```

### 8.3: Connect Using SnowSQL

```bash
# Set environment variables from secret
export SNOWFLAKE_ACCOUNT="[account-identifier]"
export SNOWFLAKE_USER="[username]"
export SNOWFLAKE_WAREHOUSE="[warehouse]"
export SNOWFLAKE_ROLE="[role]"

# Connect with key pair authentication
snowsql -a $SNOWFLAKE_ACCOUNT \
        -u $SNOWFLAKE_USER \
        --private-key-path /tmp/snowflake_key.p8 \
        -w $SNOWFLAKE_WAREHOUSE \
        -r $SNOWFLAKE_ROLE
```

### 8.4: Verify Connection

In the SnowSQL prompt, run:

```sql
-- Verify authentication
SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_WAREHOUSE();

-- Test privileges
SHOW DATABASES;

-- Exit
!exit
```

### 8.5: Cleanup

```bash
# Remove temporary key file
rm /tmp/snowflake_key.p8
```

---

## Step 9: Configure Snowflake Integration with Platform ITP

### 9.1: Create Snowflake Integration User

1. Log in to Snowflake as SECURITYADMIN
2. Run the following SQL:

```sql
-- Create role for Delinea integration
CREATE OR REPLACE ROLE DELINEA_ROLE;

-- Create user for Delinea
CREATE OR REPLACE USER DELINEA_USER 
  PASSWORD = '[secure-password]'
  DEFAULT_ROLE = DELINEA_ROLE;

-- Grant permissions for discovery
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE DELINEA_ROLE;
GRANT ROLE DELINEA_ROLE TO USER DELINEA_USER;
```

3. Copy the password for use in next step

### 9.2: Configure Snowflake Integration in Platform

1. Navigate to **Identity Posture → Integrations**
2. Click **Add Integration**
3. Select **Snowflake**
4. Configure:
   - **Integration Name:** `Snowflake - [Account-Name]`
   - **Account Identifier:** Your Snowflake account identifier
   - **Username:** `DELINEA_USER`
   - **Password:** Password from Step 9.1
   - **Warehouse:** Default warehouse
5. Click **Test Connection**
6. Verify: "Connection successful"
7. Click **Save**

### 9.3: Enable Identity Discovery

1. The integration automatically begins discovering:
   - Snowflake users
   - Role assignments
   - Privilege grants
2. Navigate to **Identity Posture → Identities**
3. Filter by source: **Snowflake**
4. Review discovered Snowflake users
5. Identify privileged users not yet vaulted in Platform

---

## Step 10: Review Session Recordings and Audit Trail

### 10.1: Review Web Session Recording

1. Navigate to **Insights → Session Review**
2. Find your recent Snowflake web session
3. Filter by:
   - Secret: `Snowflake ACCOUNTADMIN - [Account-Name]`
   - Date: Today
4. Click on the session to view details
5. Verify metadata:
   - **User:** Your username
   - **Secret:** Snowflake secret name
   - **Duration:** Session length
   - **Actions:** SQL queries executed (if keystroke logging enabled)
6. Click **Play** to review video recording
7. Verify all activity in Snowflake is captured

### 10.2: Review Access Audit Trail

1. Navigate to **Insights → Reports**
2. Run report: **Secret Access Audit**
3. Filter by:
   - Folder: `/Snowflake/Admin Accounts`
   - Date range: Last 7 days
4. Review events:
   - Secret checked out
   - Launcher opened
   - Session recorded
   - Secret checked in
5. Verify each access is linked to specific user

### 10.3: Export Compliance Report

1. In the **Secret Access Audit** report
2. Click **Export**
3. Select format: **PDF** or **CSV**
4. Save for compliance documentation
5. Verify report includes:
   - Username of accessor
   - Timestamp of access
   - Secret accessed
   - Duration of access
   - Session recording reference

---

## Step 11: Configure Automated Password Rotation (Optional)

### 11.1: Create Password Changer Account in Snowflake

1. Log in to Snowflake as ACCOUNTADMIN
2. Run SQL:

```sql
-- Create role for password management
CREATE OR REPLACE ROLE PASSWORD_ADMIN_ROLE;

-- Grant password change privileges
GRANT CREATE USER ON ACCOUNT TO ROLE PASSWORD_ADMIN_ROLE;
GRANT ROLE PASSWORD_ADMIN_ROLE TO USER DELINEA_USER;
```

### 11.2: Configure Remote Password Changing

1. Navigate to **Settings → Administration**
2. Search for **Remote Password Changing**
3. Click **Edit**
4. Verify enabled:
   - **☑ Enable Remote Password Changing**
   - **☑ Enable Heartbeat**
5. Click **Save**

### 11.3: Configure RPC for Snowflake Secret

1. Navigate to a Snowflake password-based secret
2. Click **Remote Password Changing** tab
3. Click **Edit**
4. Configure:
   - **☑ Enable Auto Change**
   - **Auto Change Schedule:** `90 Days`
   - **Change password using:** Privileged Account
   - **Privileged Account:** Select Snowflake integration user secret
5. Click **Save**

---

## Success Criteria Verification

- ✅ Snowflake ACCOUNTADMIN credentials stored in Platform vault
- ✅ Snowflake SYSADMIN credentials stored in Platform vault
- ✅ Key pair authentication configured and private keys stored securely
- ✅ Public keys assigned to Snowflake users
- ✅ Custom secret templates created for Snowflake accounts
- ✅ Security settings applied (check out, approval, session recording)
- ✅ Web launcher configured for Snowflake console access
- ✅ PRA session successfully launched to Snowflake web UI
- ✅ User logged in via password authentication through Platform
- ✅ SnowSQL connection tested using key pair from Platform
- ✅ Key pair authentication successful from command line
- ✅ Session recording captured all Snowflake console activity
- ✅ Audit trail shows username linked to each access
- ✅ Keystrokes captured (if enabled) showing SQL queries executed
- ✅ Session playback available for compliance review
- ✅ Snowflake ITP integration configured for identity discovery
- ✅ Compliance report exported with complete access history

---