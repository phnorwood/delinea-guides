# UC-1: Centralized Vault for AWS Accounts

**Objective:** Securely store AWS accounts in the Delinea Platform with dual approval for access and complete audit trails for break-glass scenarios.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine and Distributed Engine installed and active
- Session Recording is enabled
- AWS account credentials available
- At least two Platform users for dual approval workflow

**Estimated Time:** 30-45 minutes

---

## Step 1: Create Folder Structure for AWS Accounts

1. Log in to your Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Secret Server** from the left menu
3. Click **All Secrets**
4. Click **New Folder** (folder icon in toolbar)
5. Create folder:
   - Folder name: `AWS`
   - Parent folder: Leave at root level
   - Click **Create**

---

## Step 2: Create Approval Workflow for Dual Authorization

### 2.1: Create Approver Group

1. Navigate to **Access → Groups**
2. Click **Create Group**
3. Configure:
   - **Group Name:** `AWS Account Approvers`
   - **Description:** `Users authorized to approve AWS account access`
4. Click **Create**
5. Click **Add Members**
6. Search for and select at least 2 users who will serve as approvers
7. Click **Add**

### 2.2: Create Approval Workflow

1. Navigate to **Settings → Administration**
2. Search for and click **Workflows**
3. Click **Create Workflow**
4. Configure:
   - **Workflow Type:** Access request
   - **Workflow Name:** `AWS Account - Dual Approval`
   - **Description:** `Requires two approvals for AWS account access`
   - **State:** Select Enabled
5. Click **Next**
6. Under **Approval Steps**, click **Add Step**
7. Configure Step 1:
   - **Step Name:** `First Approval`
   - **Approvers:** Select group `AWS Account Approvers`
   - **Required Approvals:** `2`
   - **If Approved:** Approve the request
8. Click **Save**

---

## Step 3: Store AWS Account Credentials

### 3.1: Create the Secret

1. Navigate to **Secret Server → All Secrets**
2. Navigate to folder: `AWS`
3. Click **Create Secret**
4. Select template: **AWS IAM Console Account**
5. Configure secret details:
   - **Folder:** AWS
   - **Secret Name:** `AWS - [Account-ID]` (e.g., `AWS - 123456789012`)
   - **URL:** `https://console.aws.amazon.com`
   - **Username:** Your AWS account email or username
   - **Password:** Account password
   - **Notes:** Add account ID and purpose (e.g., "Production AWS account")
6. Click **Create Secret**

### 3.2: Configure Security Settings

1. With the secret open, click the **Security** tab
2. Click Edit next to Approval
3. Configure the following settings:
   - **Approval Type:** `Approval Always Required`
   - **Approval Workflow:** `AWS Account - Dual Approval`
4. Click **Save**
5. Scroll to **Other Security**
6. Click **Edit** next to **Emergency Access**
7. Configure:
   - **☑ Enable emergency access**
   - **Emergency access approvers:** Select `System Administrator` group
   - **Emergency reason required:** ☑ Yes
   - **Emergency access duration:** `1 hour`
8. Click **Save**

---

## Step 4: Set Up Privileged Remote Access for Web Console

### 5.1: Configure Secret Launcher

1. Return to your AWS secret: `AWS - [Account-ID]`
2. Click **Settings** tab
3. Find **Web Launcher** section
4. Click **Edit**
5. Configure:
   - **☑ Enable launcher**
   - **Launcher Type:** Web browser
   - **Launch URL:** Verify `https://console.aws.amazon.com` is populated
6. Click **Save**

### 5.2: Set Launcher as Preferred Access Method

1. Still in **Settings** tab
2. Scroll to **General**
3. Click **Edit**
4. Set **Default launcher:** `Web Browser`
5. Click **Save**

---

## Step 5: Test Dual Approval Workflow

### 6.1: Request Access (as regular user)

1. Log out of cloudadmin account
2. Log in as a regular user (not an approver)
3. Navigate to **Secret Server → All Secrets**
4. Browse to `AWS → AWS - [Account-ID]`
5. Click the secret name
6. Click **Request Access**
7. Fill out request form:
   - **Reason for access:** "Testing dual approval workflow"
   - **Access duration:** `1 hour`
8. Click **Submit Request**
9. Note: You should see "Access request pending approval"

### 6.2: Approve Request (as first approver)

1. Open a separate browser (or incognito window)
2. Log in as first approver
3. You should see notification: "You have pending approvals"
4. Navigate to **Access → Requests** (or click notification)
5. Find the pending request for AWS account
6. Click **Review**
7. Review request details:
   - Requester name
   - Reason provided
   - Duration requested
8. Click **Approve**
9. Add comment: "First approval granted"
10. Click **Submit**

### 6.3: Approve Request (as second approver)

1. Open another browser (or incognito window)
2. Log in as second approver
3. Navigate to **Access → Requests**
4. Find the same pending request (now showing 1/2 approvals)
5. Click **Review**
6. Review request details
7. Click **Approve**
8. Add comment: "Second approval granted"
9. Click **Submit**

### 6.4: Access the Secret

1. Return to the requester's browser session
2. Refresh the secret page
3. You should now see **Open with Remote Access** button
4. Click **Open with Remote Access**
5. Verify: A new browser tab opens with PRA session to AWS console
6. The credentials should auto-fill (if using Web Password Filler)
7. Log in to AWS console

---

## Step 6: Verify Audit Trail

### 7.1: Check Access Logs

1. As Platform administrator, navigate to **Insights → Reports**
2. Run report: **Secret Access Audit**
3. Filter by:
   - Secret name: `AWS - [Account-ID]`
   - Date range: Today
4. Verify the following events appear:
   - Access requested by [user]
   - Approved by [first approver]
   - Approved by [second approver]
   - Secret accessed by [user]
   - Launcher opened by [user]

### 7.2: Review Session Recording

1. Navigate to **Insights → Session Review**
2. Find the recent session for AWS console access
3. Click on the session to open details
4. Verify:
   - **User:** Shows requester username
   - **Secret:** Shows `AWS - [Account-ID]`
   - **Duration:** Shows session length
   - **Status:** Completed
5. Click **Play** to review video recording
6. Verify:
   - Login screen is visible
   - Actions in AWS console are recorded
   - Keystrokes are captured (if enabled)
7. Close video player

### 7.3: Export Audit Report

1. Navigate to **Insights → Reports**
2. Select report: **Secret Access Audit**
3. Click **Export**
4. Select format: **PDF** or **CSV**
5. Save file for compliance documentation

---

## Step 7: Document Break-Glass Emergency Access

### 8.1: Test Emergency Access (Optional)

1. Log in as System Administrator
2. Navigate to secret: `AWS - [Account-ID]`
3. Click **Request Emergency Access**
4. Provide emergency reason: "Testing break-glass procedure"
5. Click **Submit**
6. Access should be granted immediately (bypassing normal approval)
7. Note: Emergency access is fully logged with reason

### 8.2: Create Break-Glass Documentation

Document the following for your organization:

**Emergency Access Contacts:**
- Primary: [Name, Email, Phone]
- Secondary: [Name, Email, Phone]

**Break-Glass Procedure:**
1. Log in to Delinea Platform as System Administrator
2. Navigate to AWS account secret
3. Click "Request Emergency Access"
4. Provide detailed reason for emergency access
5. Access will be granted for 1 hour
6. Complete emergency task
7. Document all actions taken in incident report
8. Report emergency access usage to security team within 4 hours

**Post-Emergency Actions:**
- Review session recording
- Document all changes made in AWS
- Update change management system
- Rotate account password if compromised

---

## Step 8: Repeat for Additional AWS Accounts

For additional AWS accounts, follow the same process:

1. Store in folder: `AWS`
2. Secret name format: `AWS - [Account-ID]` or `AWS - [Username] - [Account-ID]`
3. Use same dual approval workflow
4. Adjust approval requirements based on your organization's security policies (optional)

---

## Success Criteria Verification

Verify you have successfully completed UC-1:

- ✅ AWS account credentials stored in Platform vault
- ✅ Dual approval workflow created with two required approvals
- ✅ Access request successfully submitted
- ✅ First approval granted by authorized approver
- ✅ Second approval granted by different authorized approver
- ✅ User successfully accessed AWS console via PRA
- ✅ Session recording captured all console activity
- ✅ Complete audit trail generated showing:
  - Request timestamp and requester
  - Both approval timestamps and approvers
  - Access timestamp
  - Session recording with video playback
- ✅ Emergency break-glass access tested and documented
- ✅ Audit report exported for compliance

---

**Document Version:** 1.0  
**Last Updated:** February 2026