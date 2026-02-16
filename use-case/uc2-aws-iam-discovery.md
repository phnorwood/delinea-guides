# UC-2: Discovery and Onboarding of IAM User Access Keys

**Objective:** Use the Delinea Platform's discovery capabilities to automatically find AWS IAM Users and their associated Access Keys, then import these secrets into the vault for centralized management.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine and Distributed Engine installed and active
- AWS account with IAM users and access keys to discover
- AWS IAM credentials with permissions to read IAM users and keys

**Estimated Time:** 45-60 minutes

---

## Step 1: Store AWS Discovery Credentials in Platform

1. Log in to Delinea Platform
2. Navigate to **Secret Server → All Secrets**
3. Navigate to folder: `AWS`
4. Click **Create Secret**
5. Select template: **Amazon IAM Key**
6. Configure:
   - **Folder:** `AWS`
   - **Secret Name:** `AWS Discovery Service Account - [Account-ID]`
   - **Access Key ID:** `[AWS Access Key ID]`
   - **Secret Access Key:** `[AWS Secret Access Key]`
   - **Notes:** "Service account for AWS IAM user discovery"
7. Click **Create Secret**

---

## Step 2: Configure AWS Discovery Source

### 2.1: Enable Discovery

1. Navigate to **Discovery → Configuration**
2. Click **Edit**
3. Verify **☑ Enable discovery** is checked
4. Click **Save**

### 2.2: Create Discovery Source

1. Navigate to **Discovery → Sources**
2. Click **Create Source**
3. In **Discovery type**, select **Vault**
4. Click **Amazon Web Services (AWS)**
5. Click **Continue**
6. Configure source settings:
   - **Discovery Source Name:** `AWS IAM Users - [Account-Name]`
   - **Description:** `Discovery of IAM users and access keys for [account]`
   - **Site:** Select your site
   - **Source Type:** Select `AWS (Amazon Web Services)`
   - **Secret:** Click **Select existing secret**
     - Browse to `AWS`
     - Select: `AWS Discovery Service Account - [Account-ID]`
     - Click **Select**
7. Click **Save**

### 2.3: Configure Discovery Scanners

1. The **Add discovery scanners** page appears automatically
2. Review available scanners:
   - **AWS User Scanner** - Discovers IAM users
   - **AWS Access Key Scanner** - Discovers access keys for IAM users
3. Click **Add Scanner** for:
   - ☑ AWS User Scanner
   - ☑ AWS Access Key Scanner
4. Click **Save**

---

## Step 3: Configure Discovery Rules

### 3.1: Create Import Rule for IAM Users

1. Navigate to **Discovery → Configuration**
2. Click **Import Rules** tab
3. Click **Create Rule**
4. Configure:
   - **Rule Name:** `Import AWS IAM Users`
   - **Object Type:** AWS IAM User
   - **Discovery Source:** Select `AWS IAM Users - [Account-Name]`
5. Click **Next**
6. Configure import settings:
   - **Secret Template:** AWS IAM Console Account
   - **Default Folder:** Select `AWS`
   - **Secret Name Pattern:** `AWS IAM - {Username} - [Account-ID]`
7. Click **Next**
8. Configure filters (optional):
   - **Filter by username pattern:** Leave blank to import all
   - **Exclude service accounts:** ☑ (optional)
9. Click **Save**

### 3.2: Create Import Rule for Access Keys

1. Still in **Discovery → Configuration → Import Rules**
2. Click **Create Rule**
3. Configure:
   - **Rule Name:** `Import AWS Access Keys`
   - **Object Type:** AWS Access Key
   - **Discovery Source:** Select `AWS IAM Users - [Account-Name]`
4. Click **Next**
5. Configure import settings:
   - **Secret Template:** Amazon IAM Key
   - **Default Folder:** Select `AWS`
   - **Secret Name Pattern:** `AWS Access Key - {Username} - [Account-ID]`
6. Click **Next**
7. Configure filters (optional):
   - **Import active keys only:** ☑
   - **Exclude keys older than:** 90 days (optional)
8. Click **Save**

---

## Step 4: Run Discovery Scan

### 4.1: Execute Discovery

1. Navigate to **Discovery → Network View**
2. Click **Sources** tab
3. Find your source: `AWS IAM Users - [Account-Name]`
4. Click the three dots (⋮) menu
5. Click **Run Discovery Scan**
6. Confirm: Click **Run Now**
7. Monitor progress:
   - Status will show "Running"
   - Wait 5-10 minutes for completion
   - Refresh page to see updated status

### 4.2: Review Discovery Results

1. Navigate to **Discovery → Network View**
2. Select Toggle Panel icon to the left of Search bar
3. Filter by source: `AWS IAM Users - [Account-Name]`
4. Review discovered items

---

## Step 5: Import Discovered Accounts

### 5.1: Select Accounts for Import

1. In **Discovery → Network View** tab
2. Filter to show only AWS accounts from your discovery source
3. Review the list of discovered IAM users and access keys
4. Select accounts to import:
   - ☑ Check individual accounts, or
   - ☑ Check the header checkbox to select all
5. Click **Import** button in the toolbar

### 5.2: Configure Import Settings

1. The **Import Accounts** wizard appears
2. Review pre-populated settings:
   - **Folder:** Should show `AWS` (from import rule)
   - **Secret Template:** Should show appropriate template
   - **Site:** Your discovery site
3. Configure password management:
   - Select **Import without changing password**
   - Or select **Generate new password** if you want immediate rotation
4. Click **Next**

### 5.3: Complete Import

1. Review summary:
   - Number of accounts to import
   - Target folder
   - Secret naming pattern
2. Click **Import**
3. Wait for import to complete (30-60 seconds)
4. Click **Close** when finished

---

## Step 6: Verify Imported Secrets

### 6.1: Check Vault Contents

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `AWS`
3. Verify new secrets appear:
   - Format: `AWS IAM - [username] - [Account-ID]`
   - Format: `AWS Access Key - [username] - [Account-ID]`
4. Count should match number of accounts imported

### 6.2: Inspect Individual Secret

1. Click on one of the imported secrets
2. Verify **Overview** tab contains:
   - Username
   - Access Key
   - Secret Key
3. Click **Discovery** tab
4. Verify:
   - **Discovery Source:** Shows your AWS discovery source
   - **State:** Enabled
   - **Last Run:** Shows recent timestamp

---

## Step 7: Test Discovered Credentials

### 7.1: Verify IAM User Secret

1. Navigate to one of the imported IAM user secrets
2. Click **Overview** tab
3. Note the username
4. If password was imported, use AWS console to verify:
   - Navigate to AWS Console login
   - Enter IAM username
   - Enter password from secret
   - Verify successful authentication (or verify password needs reset if not imported)

### 7.2: Verify Access Key Secret

1. Navigate to one of the imported access key secrets
2. Click **Overview** tab
3. Copy the **Access Key ID** and **Secret Access Key**
4. Test using AWS CLI (if installed):
   ```bash
   aws configure set aws_access_key_id [Access-Key-ID]
   aws configure set aws_secret_access_key [Secret-Access-Key]
   aws iam get-user
   ```
5. Verify command returns user information
6. Or verify in AWS Console:
   - Navigate to **IAM → Users → [username] → Security credentials**
   - Verify Access Key ID matches what was discovered

---

## Success Criteria Verification

Verify you have successfully completed UC-2:

- ✅ AWS IAM discovery service account created with appropriate permissions
- ✅ Discovery credentials stored securely in Platform vault
- ✅ AWS discovery source configured and enabled
- ✅ Discovery scanners configured for IAM users and access keys
- ✅ Discovery scan executed successfully
- ✅ IAM users discovered and displayed in Network View
- ✅ Access keys discovered and associated with correct IAM users
- ✅ Discovered accounts imported into vault with proper naming
- ✅ Secrets created in correct folder structure
- ✅ Discovery metadata visible in imported secrets
- ✅ Imported credentials tested and verified functional

---