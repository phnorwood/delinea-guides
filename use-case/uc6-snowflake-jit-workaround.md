# UC-6: Time-Limited Access for Snowflake Privileged Roles

**Objective:** Provide time-bound access to Snowflake SYSADMIN credentials through the Delinea Platform with approval workflows and automatic access expiration. While the Platform does not support automated JIT role elevation for Snowflake, this workflow provides time-limited credential checkout with full audit trails as an alternative approach.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Snowflake SYSADMIN credentials stored in Platform (from UC-4)
- At least two users: one requester and one approver
- Platform Engine with PRA workload active

**Estimated Time:** 30-45 minutes

---

## Step 1: Understand the Limitation

### 1.1: Platform Capabilities vs. Requirements

**What the Platform Provides:**
- ✅ Time-limited credential checkout
- ✅ Approval workflows for access
- ✅ Automatic credential check-in after time expires
- ✅ Session recording of Snowflake console activity
- ✅ Complete audit trail of access

**What the Platform Does NOT Provide:**
- ❌ Automatic granting of SYSADMIN role in Snowflake
- ❌ Automatic revocation of SYSADMIN role after time window
- ❌ Direct integration with Snowflake RBAC system

**Workaround Approach:**
Users check out SYSADMIN credentials for a time-limited window, use them to perform elevated tasks, then credentials automatically check back in. The user must manually switch roles within Snowflake.

---

## Step 2: Configure Snowflake SYSADMIN Secret for Time-Limited Access

### 2.1: Verify or Create SYSADMIN Secret

1. Log in to Delinea Platform
2. Navigate to **Secret Server → All Secrets**
3. Browse to folder: `/Snowflake/Admin Accounts`
4. If SYSADMIN secret doesn't exist:
   - Click **Create Secret**
   - Template: **Snowflake Account**
   - Configure:
     - **Secret Name:** `Snowflake SYSADMIN - [Account-Name]`
     - **URL:** `https://[account-identifier].snowflakecomputing.com`
     - **Username:** SYSADMIN username
     - **Password:** SYSADMIN password
     - **Role:** `SYSADMIN`
   - Click **Create Secret**

### 2.2: Configure Check Out Settings

1. Open the Snowflake SYSADMIN secret
2. Click **Security** tab
3. Click **Edit**
4. Enable check out:
   - **☑ Check out** (enables exclusive, time-limited access)
   - **Check out interval:** `2 hours` (customize as needed)
   - **☑ Check out change password** (optional - rotates password after use)
5. Click **Save**

### 2.3: Configure Additional Security Settings

1. Still in **Security** tab, ensure these are enabled:
   - **☑ Require comment** (document purpose of elevated access)
   - **☑ Session recording** (record all Snowflake console activity)
   - **☑ Hide launcher password** (prevent password viewing)
2. Click **Save**

---

## Step 3: Create Time-Based Approval Workflow

### 3.1: Create Approver Group

1. Navigate to **Access → Groups**
2. Click **Create Group**
3. Configure:
   - **Group Name:** `Snowflake Privilege Approvers`
   - **Description:** `Approvers for Snowflake SYSADMIN access`
4. Click **Create**
5. Add members:
   - Click **Add Members**
   - Select managers or senior data analysts
   - Click **Add**

### 3.2: Create Approval Workflow

1. Navigate to **Settings → Administration**
2. Search for **Approval Workflows**
3. Click **Create Workflow**
4. Configure:
   - **Workflow Name:** `Snowflake SYSADMIN Time-Limited Access`
   - **Description:** `Approval for time-bound SYSADMIN credential access`
5. Click **Next**
6. Click **Add Step**
7. Configure approval step:
   - **Step Name:** `Manager Approval`
   - **Approvers:** Select group `Snowflake Privilege Approvers`
   - **Required Approvals:** `1`
   - **Approval Duration:** `4 hours` (time window to respond to request)
8. Click **Add**
9. Click **Save**

### 3.3: Apply Workflow to SYSADMIN Secret

1. Return to Snowflake SYSADMIN secret
2. Click **Security** tab
3. Click **Edit**
4. Configure:
   - **☑ Require approval for access**
   - **Approval Workflow:** Select `Snowflake SYSADMIN Time-Limited Access`
5. Under **Access Request Options**:
   - **Default access duration:** `2 hours`
   - **Maximum access duration:** `4 hours`
   - **Minimum justification length:** `50 characters`
6. Click **Save**

---

## Step 4: Grant User Access to SYSADMIN Secret

### 4.1: Configure Secret Permissions

1. With the SYSADMIN secret open, click **Security** tab
2. Scroll to **Permissions**
3. Click **Edit Permissions**
4. Click **Add**
5. Configure:
   - **User/Group:** Select data analyst group or individual users
   - **Role:** Select **View** (sufficient for checkout)
6. Click **Save**

### 4.2: Verify User Can See Secret

1. Log out of admin account
2. Log in as a regular user (data analyst)
3. Navigate to **Secret Server → All Secrets**
4. Browse to `/Snowflake/Admin Accounts`
5. Verify: SYSADMIN secret is visible
6. Click on secret - should see "Request Access" option
7. Log back in as admin

---

## Step 5: Test Time-Limited Access Request (As User)

### 5.1: Request SYSADMIN Access

1. Log in as data analyst (regular user)
2. Navigate to **Secret Server → All Secrets**
3. Browse to `/Snowflake/Admin Accounts`
4. Click on: `Snowflake SYSADMIN - [Account-Name]`
5. Click **Request Access**
6. Fill out request form:
   - **Reason for access:** "Need to create new warehouse for Q1 reporting project. Will create REPORTING_WH with XSMALL size and configure auto-suspend."
   - **Duration:** `2 hours`
7. Click **Submit Request**
8. Verify message: "Access request submitted and pending approval"
9. Note: User **cannot** access credentials yet

### 5.2: Approve Access Request (As Manager)

1. Open new browser (or incognito window)
2. Log in as approver
3. Navigate to **Access → Requests**
4. Find the pending SYSADMIN access request
5. Click **Review**
6. Review details:
   - **Requester:** Data analyst name
   - **Secret:** Snowflake SYSADMIN
   - **Duration:** 2 hours
   - **Justification:** Warehouse creation for Q1 reporting
7. Verify justification is adequate
8. Click **Approve**
9. Add comment: "Approved for warehouse creation. Please follow naming standards."
10. Click **Submit**

---

## Step 6: Access SYSADMIN Credentials and Perform Privileged Task

### 6.1: Check Out Credentials

1. As the data analyst, refresh the secret page
2. You should now see **Check Out** button (or auto-checked out)
3. If not automatic, click **Check Out**
4. Verify:
   - Secret shows "Checked Out by You"
   - Checkout timer is visible (e.g., "1:59:45 remaining")
   - **Open with Remote Access** button is now available

### 6.2: Launch Snowflake Session via PRA

1. Click **Open with Remote Access**
2. PRA session opens to Snowflake login page
3. Credentials auto-fill (or manually sign in)
4. Log in to Snowflake web UI
5. Verify you are logged in as SYSADMIN user

### 6.3: Perform Privileged Task in Snowflake

1. Once in Snowflake console, verify current role:
   ```sql
   SELECT CURRENT_ROLE();
   -- Should show: SYSADMIN
   ```

2. Create the warehouse as specified in request:
   ```sql
   CREATE WAREHOUSE REPORTING_WH 
   WITH 
     WAREHOUSE_SIZE = 'XSMALL'
     AUTO_SUSPEND = 300
     AUTO_RESUME = TRUE
     INITIALLY_SUSPENDED = TRUE;
   ```

3. Verify warehouse creation:
   ```sql
   SHOW WAREHOUSES LIKE 'REPORTING_WH';
   ```

4. Grant appropriate permissions:
   ```sql
   GRANT USAGE ON WAREHOUSE REPORTING_WH TO ROLE ANALYST;
   ```

5. Document actions in Snowflake:
   ```sql
   -- Add comment for audit
   ALTER WAREHOUSE REPORTING_WH 
     SET COMMENT = 'Created for Q1 reporting - [Your Name] - [Date]';
   ```

### 6.4: Complete and Sign Out

1. Verify all tasks completed
2. In Snowflake console, click profile → **Sign Out**
3. Close PRA browser tab
4. Return to Platform

---

## Step 7: Automatic Credential Check-In

### 7.1: Monitor Checkout Timer

1. As the data analyst, view the SYSADMIN secret
2. Note the checkout timer counting down
3. Options:
   - **Option A:** Wait for automatic check-in (when timer expires)
   - **Option B:** Manually check in early (if task completed)

### 7.2: Manual Check-In (Optional)

1. With the secret open, click **Check In**
2. Confirm: "Are you sure you want to check in this secret?"
3. Click **Yes**
4. Verify:
   - Secret no longer shows as checked out
   - Timer disappears
   - Cannot access credentials anymore

### 7.3: Automatic Check-In

1. If you do **not** manually check in:
2. After 2 hours (or configured duration):
   - Secret automatically checks in
   - Access to credentials is revoked
   - Any open PRA sessions may terminate
3. Verify by refreshing secret page:
   - Shows "Not checked out"
   - "Check Out" button reappears (but requires new approval)

---

## Step 8: Review Access Audit Trail

### 8.1: Review Secret Access Log

1. As administrator, navigate to the SYSADMIN secret
2. Click **Audit** tab
3. Review logged events:
   - Access requested by [data analyst] at [timestamp]
   - Approved by [manager] at [timestamp]
   - Secret checked out at [timestamp]
   - Secret checked in at [timestamp] (or auto check-in)
   - Duration: [actual time used]
4. Verify each action is timestamped

### 8.2: Review Session Recording

1. Navigate to **Insights → Session Review**
2. Find the Snowflake session:
   - Filter by **Secret:** Snowflake SYSADMIN
   - Filter by **User:** Data analyst name
   - Filter by **Date:** Today
3. Click on the session
4. Verify session details:
   - **User:** Data analyst username
   - **Duration:** Time spent in Snowflake
   - **Actions:** SQL commands executed (if keystroke logging enabled)
5. Click **Play** to review recording
6. Verify recording shows:
   - Login to Snowflake
   - CREATE WAREHOUSE command executed
   - GRANT command executed
   - Sign out

### 8.3: Verify SQL Commands in Snowflake (Optional)

1. As Snowflake administrator, log in to Snowflake
2. Run query history check:
   ```sql
   SELECT 
     query_text,
     user_name,
     role_name,
     start_time,
     end_time,
     execution_status
   FROM 
     SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
   WHERE 
     user_name = '[SYSADMIN-USERNAME]'
     AND start_time >= DATEADD(hour, -3, CURRENT_TIMESTAMP())
   ORDER BY 
     start_time DESC;
   ```

3. Verify queries executed during the 2-hour window:
   - CREATE WAREHOUSE REPORTING_WH
   - GRANT USAGE ON WAREHOUSE
   - ALTER WAREHOUSE (comment)

---

## Step 9: Configure Automated Notifications

### 9.1: Create Alert for SYSADMIN Access

1. Navigate to **Settings → Administration**
2. Search for **Event Subscriptions**
3. Click **Create Subscription**
4. Configure:
   - **Subscription Name:** `Snowflake SYSADMIN Access Alert`
   - **Event Type:** Secret Checked Out
   - **Filter by secret:** Select Snowflake SYSADMIN secret
   - **Alert method:** Email
   - **Recipients:** Security team and Snowflake administrators
5. Click **Save**

### 9.2: Create Alert for Access Expiration

1. Click **Create Subscription** again
2. Configure:
   - **Subscription Name:** `Snowflake SYSADMIN Access Expired`
   - **Event Type:** Secret Checked In
   - **Filter by secret:** Select Snowflake SYSADMIN secret
   - **Alert method:** Email
   - **Recipients:** Security team
5. Click **Save**

---

## Step 10: Document Time-Limited Access Procedures

### 10.1: Create User Guide

Document the following for data analysts:

**Requesting SYSADMIN Access:**
1. Navigate to Snowflake SYSADMIN secret in Platform
2. Click "Request Access"
3. Provide detailed justification (minimum 50 characters):
   - What task needs SYSADMIN privileges
   - What objects will be created/modified
   - Expected duration
4. Select duration: 2-4 hours maximum
5. Submit request
6. Wait for manager approval (typically within 1 hour)
7. Once approved, credentials automatically check out
8. Access expires after approved duration

**Using SYSADMIN Access:**
1. Click "Open with Remote Access" in Platform
2. Log in to Snowflake (credentials auto-fill)
3. Verify current role is SYSADMIN
4. Perform only the approved tasks
5. Document all actions with comments in Snowflake
6. Sign out when complete
7. Manually check in credentials in Platform (optional)
8. Access automatically expires after time window

**Important Notes:**
- Access is time-limited (2-4 hours)
- All actions are recorded and audited
- Unauthorized use will be flagged
- Abuse may result in access revocation

### 10.2: Create Approver Guide

Document for managers who approve requests:

**Reviewing SYSADMIN Access Requests:**
1. Check email notification or Platform for pending requests
2. Review justification carefully:
   - Is the task legitimate?
   - Does it require SYSADMIN privileges?
   - Is the duration reasonable?
3. Verify requester's role and need
4. Approve or deny with explanation
5. If approved, add guidance in approval comment
6. Monitor for completion

**Post-Approval Monitoring:**
- Review session recordings after access expires
- Verify only approved actions were performed
- Check Snowflake query history for validation
- Report any unauthorized actions to security team

---

## Success Criteria Verification

Verify you have successfully completed UC-6 (with Platform limitations):

- ✅ Snowflake SYSADMIN credentials configured for time-limited checkout
- ✅ Check out interval configured (2 hours)
- ✅ Approval workflow created and applied to SYSADMIN secret
- ✅ Data analyst requested access with detailed justification
- ✅ Manager reviewed and approved access request
- ✅ Credentials automatically checked out to analyst for approved duration
- ✅ Analyst accessed Snowflake console via PRA
- ✅ Analyst performed privileged task (created warehouse)
- ✅ All actions recorded in session recording
- ✅ Credentials automatically checked in after time window expired
- ✅ Full audit trail generated showing:
  - Access request timestamp and requester
  - Approval timestamp and approver
  - Checkout timestamp
  - Actions performed in Snowflake
  - Check-in timestamp (manual or automatic)
- ✅ SQL commands visible in session recording (if keystroke logging enabled)
- ✅ Security team notified of privileged access usage

---