# Use-Case: Brokered Web Session to Cloud Consoles

**Objective:** Instead of giving an engineer direct credentials to an AWS Admin IAM User, they request access through the Delinea Platform. The Platform launches a browser session via Privileged Remote Access (PRA) to the AWS Management Console without the user ever seeing the password. The entire session is recorded for playback.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine with PRA workload installed and active
- AWS IAM admin account credentials stored in Platform (from UC-1 or UC-2)
- At least one non-admin user to test access request workflow
- Session recording enabled globally

**Estimated Time:** 30-45 minutes

---

## Step 1: Verify PRA Configuration

### 1.1: Check Platform Engine Status

1. Log in to Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Settings → Engine Management**
3. Click on your site
4. Click **Engines** tab
5. Verify your Platform Engine shows:
   - **Status:** Active
   - **Workloads:** PRA (Privileged Remote Access) listed
6. If PRA workload is not active:
   - Click **Edit Engine**
   - Enable **☑ Privileged Remote Access**
   - Click **Save**

### 1.2: Verify Session Recording is Enabled

1. Navigate to **Settings → Administration**
2. Search for and click **Session Recording**
3. Verify settings:
   - **☑ Enable session recording**
   - **☑ Record web sessions**
   - **☑ Record keystrokes** (optional)
   - **Storage location:** Database (default)
4. If not enabled, click **Edit**, enable settings, and click **Save**

---

## Step 2: Configure AWS IAM Admin Secret for PRA

### 2.1: Select or Create AWS Admin Secret

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `/AWS/Admin Accounts`
3. If you don't have an AWS admin secret yet:
   - Click **Create Secret**
   - Template: **AWS IAM Console Account**
   - Configure:
     - **Secret Name:** `AWS IAM Admin - [Username] - [Account-ID]`
     - **URL:** `https://console.aws.amazon.com`
     - **Username:** AWS IAM username
     - **Password:** IAM user password
   - Click **Create Secret**

### 2.2: Configure Secret for Brokered Access

1. Open the AWS admin secret
2. Click **Security** tab
3. Click **Edit**
4. Configure security settings:
   - **☑ Require comment** (forces reason documentation)
   - **☑ Require approval for access** (optional - select workflow)
   - **☑ Hide launcher password** (CRITICAL - prevents password viewing)
   - **☑ Session recording** (captures all console activity)
   - **☑ Check out** (optional - enables exclusive access)
     - Check out interval: `2 hours`
5. Click **Save**

### 2.3: Configure Web Launcher Settings

1. Still in the secret, click **Settings** tab
2. Find **Web Launcher** section
3. Click **Edit**
4. Configure:
   - **☑ Enable launcher**
   - **Launcher Type:** Web browser (via Remote Access)
   - **Launch URL:** `https://console.aws.amazon.com`
   - **☑ Use PRA for web sessions**
5. Under **Launcher Behavior**:
   - **☑ Auto-fill credentials** (uses Web Password Filler)
   - **☑ Auto-submit login form** (optional)
6. Click **Save**

---

## Step 3: Configure Access Request Workflow (Optional)

*Skip this step if not requiring approval workflow*

### 3.1: Create Approver Group

1. Navigate to **Access → Groups**
2. Click **Create Group**
3. Configure:
   - **Group Name:** `AWS Console Access Approvers`
   - **Description:** `Approvers for AWS Management Console access`
4. Click **Create**
5. Click **Add Members**
6. Select users who can approve AWS console access
7. Click **Add**

### 3.2: Create Access Request Workflow

1. Navigate to **Settings → Administration**
2. Search for **Approval Workflows**
3. Click **Create Workflow**
4. Configure:
   - **Workflow Name:** `AWS Console Access Approval`
   - **Description:** `Single approval for AWS console access via PRA`
5. Click **Next**
6. Click **Add Step**
7. Configure:
   - **Step Name:** `Manager Approval`
   - **Approvers:** Select group `AWS Console Access Approvers`
   - **Required Approvals:** `1`
   - **Approval Duration:** `4 hours`
8. Click **Add**
9. Click **Save**

### 3.3: Apply Workflow to Secret

1. Return to your AWS admin secret
2. Click **Security** tab
3. Click **Edit**
4. Under **Access Control**:
   - **☑ Require approval for access**
   - **Approval Workflow:** Select `AWS Console Access Approval`
5. Click **Save**

---

## Step 4: Configure User Permissions

### 4.1: Grant User Access to Secret

1. With the AWS secret open, click **Security** tab
2. Scroll to **Permissions**
3. Click **Edit Permissions**
4. Click **Add**
5. Configure:
   - **User/Group:** Select the user or group who needs AWS console access
   - **Role:** Select **View** or **Owner** (View is sufficient for PRA access)
6. Click **Save**
7. Verify user appears in permissions list

---

## Step 5: Test Access Request (As Regular User)

### 5.1: Request Access to AWS Console

1. Log out of admin account
2. Log in as a regular user (who has View permission on the secret)
3. Navigate to **Secret Server → All Secrets**
4. Browse to `/AWS/Admin Accounts`
5. Click on the AWS admin secret
6. If approval is required:
   - Click **Request Access**
   - Fill out request form:
     - **Reason:** "Need to review S3 bucket permissions for Project X"
     - **Duration:** `2 hours`
   - Click **Submit Request**
   - You should see: "Access request pending approval"
7. If no approval required:
   - Proceed directly to Step 6

### 5.2: Approve Access Request (As Approver)

*If using approval workflow:*

1. Open new browser window (or incognito)
2. Log in as an approver
3. You should see notification: "Pending approvals"
4. Navigate to **Access → Requests**
5. Find the AWS console access request
6. Click **Review**
7. Review request details:
   - Requester name and email
   - Secret requested
   - Reason provided
   - Duration requested
8. Click **Approve**
9. Add comment: "Approved for project work"
10. Click **Submit**

---

## Step 6: Launch Brokered Session to AWS Console

### 6.1: Access Secret via PRA

1. As the regular user (from Step 5.1), refresh the secret page
2. You should now see **Open with Remote Access** button
3. Click **Open with Remote Access**
4. If prompted, select:
   - **Site:** Your PRA site
   - **Target:** Leave blank or confirm default
5. Click **Continue**

### 6.2: Verify PRA Session Launch

1. A new browser tab opens with PRA session
2. You should see:
   - PRA connection banner at top (may be minimal)
   - AWS Console login page loading
   - Session recording indicator (if not hidden)
3. Verify the following:
   - **Password is NOT visible** to the user
   - Login page loads in PRA session
   - Username may be pre-filled
4. Credentials should auto-fill (if Web Password Filler configured)
5. Click **Sign In** (or credentials auto-submit)

### 6.3: Perform Actions in AWS Console

1. Once logged in, navigate through AWS console:
   - Go to **Services → S3**
   - Click on a bucket
   - View bucket properties
2. Navigate to another service:
   - Go to **Services → EC2**
   - View EC2 instances
   - Click on an instance to view details
3. Perform a test action:
   - Go to **Services → IAM**
   - Click **Users**
   - View list of IAM users (do not modify)
4. These actions are being recorded

---

## Step 7: Monitor Active Session (As Administrator)

### 7.1: View Live Session

1. In a separate browser, log in as Platform administrator
2. Navigate to **Insights → Session Review**
3. Find the active session:
   - Filter by **Status:** Active
   - Find session for AWS console secret
4. Click on the active session
5. Verify details shown:
   - **User:** Regular user's name
   - **Secret:** AWS admin secret name
   - **Status:** Active/In Progress
   - **Duration:** Current session length

### 7.2: Watch Live Session (Optional)

1. If live monitoring is enabled, click **Watch Live**
2. You can see the user's actions in real-time
3. Observe:
   - AWS console navigation
   - Pages accessed
   - Actions performed

### 7.3: Send Message to User (Optional)

1. With active session selected
2. Click **Send Message**
3. Type message: "Please complete your task within 30 minutes"
4. Click **Send**
5. User sees message pop up in their PRA session

---

## Step 8: End Session and Verify Recording

### 8.1: End User Session

1. As the regular user in the PRA session:
2. Complete AWS console work
3. In AWS console, click profile menu → **Sign Out**
4. Close the PRA browser tab
5. Return to Platform
6. Verify secret automatically checks in (if check out was enabled)

### 8.2: Verify Session Recording Created

1. As administrator, navigate to **Insights → Session Review**
2. Find the completed session:
   - Filter by **Status:** Completed
   - Filter by **Secret:** AWS admin secret
   - Filter by **Date:** Today
3. Click on the session
4. Verify session details:
   - **User:** Regular user's username
   - **Secret:** AWS admin secret name
   - **Duration:** Total session length
   - **Status:** Completed
   - **Recording:** Available for playback

---

## Step 9: Review and Verify Session Recording

### 9.1: Play Back Session Recording

1. With the completed session open, click **Play** button
2. Video player loads with session recording
3. Verify recording shows:
   - AWS Console login page
   - Credentials auto-filling (password is masked)
   - User clicking Sign In
   - AWS console home page loading
   - Navigation through services (S3, EC2, IAM)
   - All pages visited
   - User signing out

### 9.2: Review Session Activity Metadata

1. Scroll down to **Activity** section
2. If keystroke logging enabled, review:
   - Timestamps of actions
   - Pages accessed
   - Mouse clicks recorded
   - Any text entered in search boxes
3. Verify activity map shows:
   - High activity during console navigation
   - Timeline of session from start to end

### 9.3: Search Session Content (If Available)

1. If session has searchable content (keystroke logging)
2. Use **Search** function to find specific actions:
   - Search for: "S3"
   - Verify: Highlights timestamp when S3 service was accessed
   - Search for: "IAM"
   - Verify: Highlights timestamp when IAM was accessed
3. Click search results to jump to that point in video

---

## Step 10: Generate Audit Report

### 10.1: Create Session Access Report

1. Navigate to **Insights → Reports**
2. Select report: **Session Recording Report**
3. Configure filters:
   - **Secret:** Select AWS admin secret(s)
   - **Date Range:** Last 30 days
   - **User:** All users (or specific user)
4. Click **Run Report**
5. Review report data:
   - Date and time of each session
   - User who accessed console
   - Duration of each session
   - Secret used for access

### 10.2: Export Audit Report

1. Click **Export**
2. Select format: **PDF** or **CSV**
3. Save file
4. Verify report includes:
   - Username linked to each session
   - Timestamp of access
   - AWS secret accessed
   - Session recording reference ID
   - Duration of access

### 10.3: Create Compliance Documentation

Document the following for compliance:

**Session Recording Evidence:**
- Session ID: [from recording]
- User: [username]
- Secret: AWS IAM Admin - [username]
- Date/Time: [timestamp]
- Duration: [minutes]
- Actions performed: Viewed S3 buckets, EC2 instances, IAM users
- Recording location: [Platform session review]
- Approval: [approver name and timestamp, if applicable]

---

## Step 11: Configure Additional PRA Settings (Optional)

### 11.1: Enable Session Timeout

1. Navigate to **Settings → Administration**
2. Search for **Session Settings**
3. Click **Edit**
4. Configure:
   - **☑ Enable session timeout**
   - **Timeout after idle:** `15 minutes`
   - **☑ Warn user before timeout** (2 minutes warning)
5. Click **Save**

### 11.2: Configure Session Recording Retention

1. Navigate to **Settings → Administration**
2. Search for **Session Recording**
3. Click **Edit**
4. Configure:
   - **Recording retention:** `90 days` (or per compliance requirements)
   - **☑ Archive old recordings** (optional)
   - **Archive location:** Specify storage (if applicable)
5. Click **Save**

### 11.3: Enable Session Alerts

1. Navigate to **Settings → Administration**
2. Search for **Event Subscriptions**
3. Click **Create Subscription**
4. Configure:
   - **Subscription Name:** `High-Risk AWS Console Access`
   - **Event Type:** Session Started
   - **Filter by secret folder:** `/AWS/Admin Accounts`
   - **Alert method:** Email
   - **Recipients:** Security team distribution list
5. Click **Save**

---

## Success Criteria Verification

- ✅ AWS IAM admin credentials stored in Platform vault
- ✅ Secret configured with "Hide launcher password" enabled
- ✅ Web launcher configured to use PRA for sessions
- ✅ User requested access through Platform (no direct password access)
- ✅ Approval workflow processed (if configured)
- ✅ Access granted for specified duration
- ✅ Engineer launched PRA session to AWS Management Console
- ✅ User did NOT see the password at any point
- ✅ Credentials auto-filled in AWS login page via PRA
- ✅ User successfully performed actions in AWS console (viewed S3 bucket)
- ✅ Administrator monitored active session in real-time
- ✅ Entire session recorded from login to logout
- ✅ Session recording available for playback
- ✅ Recording shows all AWS console activity performed
- ✅ User identity linked to session in audit trail
- ✅ Compliance report generated with session details
- ✅ Full audit trail available showing request → approval → access → actions

---