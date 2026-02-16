# UC-11: Comprehensive Audit Trail for Compliance Reporting

**Objective:** Generate reports showing who accessed which cloud account (AWS, GCP, Snowflake), when, from where, and what they did via session recording. Demonstrate the ability to play back recorded console sessions for compliance and audit purposes.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Cloud credentials stored from UC-1, UC-3, and UC-4
- Session recording enabled globally
- Several recorded sessions available from previous use case testing
- PRA sessions completed for AWS, GCP, or Snowflake consoles

**Estimated Time:** 30-45 minutes

---

## Step 1: Verify Session Recording Configuration

### 1.1: Check Global Session Recording Settings

1. Log in to Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Settings → Administration**
3. Search for **Session Recording**
4. Verify settings are enabled:
   - **☑ Enable session recording**
   - **☑ Record web sessions**
   - **☑ Record SSH sessions**
   - **☑ Record keystrokes**
5. Note **Storage location** (Database or file share)
6. Note **Retention period** (e.g., 90 days)

---

## Step 2: Access Session Review Dashboard

### 2.1: Navigate to Session Review

1. Navigate to **Insights → Session Review**
2. This displays all recorded sessions
3. Default view shows recent sessions with columns:
   - **User:** Who accessed the secret
   - **Secret:** Which credential was used
   - **Target:** Host/URL accessed
   - **Protocol:** RDP, SSH, Web
   - **Start Time:** When session began
   - **Duration:** How long session lasted
   - **Status:** Completed, Active, Failed

### 2.2: Review Session Metrics

1. At the top of Session Review page, note summary metrics:
   - **Total Sessions:** Count of all recorded sessions
   - **Active Sessions:** Currently in progress
   - **Sessions Today:** Count from last 24 hours
   - **Average Duration:** Mean session length
2. Review session distribution chart (if available)

---

## Step 3: Filter and Search Sessions

### 3.1: Filter by Cloud Platform

1. In **Session Review**, use filters:
   - **Protocol:** Select "Web"
   - **Secret Folder:** Select `/AWS/Admin Accounts`
2. Click **Apply**
3. Results show only AWS console sessions
4. Clear filter and repeat for:
   - GCP: `/GCP/Service Accounts`
   - Snowflake: `/Snowflake/Admin Accounts`

### 3.2: Filter by User

1. Click **User** filter dropdown
2. Select specific user (e.g., data analyst)
3. Click **Apply**
4. Results show all sessions by that user across all platforms

### 3.3: Filter by Date Range

1. Click **Date Range** selector
2. Options:
   - Today
   - Last 7 days
   - Last 30 days
   - Custom range
3. Select **Last 30 days**
4. Click **Apply**

### 3.4: Search by Secret Name

1. Use search box: "AWS IAM Admin"
2. Results show sessions using any AWS IAM admin secret
3. Clear and search: "Snowflake SYSADMIN"
4. Results show Snowflake elevated access sessions

---

## Step 4: Review Individual Session Details

### 4.1: Select a Session

1. From filtered results, click on a session row
2. Session detail panel opens showing:
   - **Session Information:**
     - Session ID
     - User who initiated
     - Secret used
     - Target system
     - Source IP address
     - Start/end timestamps
     - Total duration
   - **Activity Summary:**
     - Pages visited (for web)
     - Commands executed (for SSH)
     - Applications launched (for RDP)

### 4.2: Review Session Metadata

Verify the following metadata is captured:

**Identity Information:**
- ✅ Username (Platform user)
- ✅ Email address
- ✅ User's role/group membership

**Access Information:**
- ✅ Secret name and ID
- ✅ Credential used (username on target system)
- ✅ Target system (AWS account, GCP project, Snowflake account)

**Session Information:**
- ✅ Start timestamp (date, time, timezone)
- ✅ End timestamp
- ✅ Duration (minutes:seconds)
- ✅ Source IP address
- ✅ Geographic location (if available)

**Activity Information:**
- ✅ Protocol used (HTTPS, SSH, RDP)
- ✅ Pages/screens accessed
- ✅ Commands/actions performed

---

## Step 5: Play Back Session Recording

### 5.1: Launch Video Playback

1. With session details open, click **Play** button
2. Video player opens in new window or panel
3. Recording begins playing automatically

### 5.2: Review Session Recording

For AWS Console Session:
1. Observe recording shows:
   - AWS login page loading
   - Credentials auto-filling (password masked)
   - Console home page
   - Navigation to services (S3, EC2, IAM, etc.)
   - Actions performed in each service
   - Sign out process

For Snowflake Session:
1. Observe recording shows:
   - Snowflake login
   - Role verification
   - SQL worksheet
   - Queries executed (if keystroke logging enabled)
   - Database/warehouse navigation
   - Sign out

For SSH Session:
1. Observe recording shows:
   - Terminal connection
   - Command prompt
   - Each command typed
   - Command output
   - Exit command

### 5.3: Use Playback Controls

Available controls:
- **Play/Pause:** Control playback
- **Speed:** 0.5x, 1x, 1.5x, 2x speed
- **Skip:** Jump forward/backward 10 seconds
- **Timeline:** Click to jump to specific time
- **Full Screen:** Expand to full screen
- **Download:** Save recording locally (if permitted)

---

## Step 6: Search Session Activity

### 6.1: Search for Specific Actions (Web Sessions)

1. With session details open, scroll to **Activity** section
2. If available, use **Search** function
3. Search for keywords:
   - "S3" - jumps to S3 service access
   - "bucket" - finds bucket operations
   - "delete" - locates delete actions
4. Click search result to jump to that timestamp in video

### 6.2: Review Command History (SSH Sessions)

1. For SSH sessions, find **Commands** tab
2. View list of all commands executed:
   ```
   [10:15:23] ssh user@bastion-host
   [10:15:45] whoami
   [10:15:50] ls -la /var/www
   [10:16:10] sudo systemctl restart nginx
   [10:16:30] tail -f /var/log/nginx/error.log
   [10:17:45] exit
   ```
3. Each command shows:
   - Timestamp
   - Exact command text
   - Working directory (if captured)
4. Click command to jump to that point in recording

### 6.3: Review Keystroke Data (If Enabled)

1. If keystroke logging is enabled, review:
   - Text entered in search boxes
   - Form data entered
   - SQL queries typed
   - Commands before execution
2. Note: Passwords are typically masked even in keystroke logs

---

## Step 7: Generate Compliance Reports

### 7.1: Create Cloud Access Report

1. Navigate to **Insights → Reports**
2. Click **Create Report** or select pre-built report
3. Select report type: **Secret Access Audit** or **Session Recording Report**
4. Configure report parameters:
   - **Name:** `Cloud Account Access Report - Q1 2026`
   - **Date Range:** Last 90 days (or compliance period)
   - **Scope:** Select folders:
     - `/AWS/Admin Accounts`
     - `/GCP/Service Accounts`
     - `/Snowflake/Admin Accounts`
   - **Include:** 
     - ☑ User information
     - ☑ Access timestamps
     - ☑ Session duration
     - ☑ Source IP addresses
     - ☑ Actions performed
5. Click **Generate Report**

### 7.2: Review Report Contents

Report includes:

**Summary Section:**
- Total access events: 247
- Unique users: 15
- Total session time: 45.5 hours
- Most accessed account: AWS IAM Admin - prod-deploy

**Detailed Access Log:**
| Date/Time | User | Secret | Target | Source IP | Duration | Actions |
|-----------|------|--------|--------|-----------|----------|---------|
| 2026-02-01 09:15 | john.doe@company.com | AWS IAM Admin - prod | AWS Console | 192.168.1.45 | 28m | Viewed S3, EC2 |
| 2026-02-01 14:30 | jane.smith@company.com | Snowflake SYSADMIN | Snowflake Web | 192.168.1.67 | 45m | Created warehouse |
| 2026-02-03 10:00 | bob.jones@company.com | GCP SA - prod-deploy | GCP Console | 192.168.1.89 | 15m | Viewed GKE clusters |

**Session Recording References:**
- Each row includes Session ID for video playback
- Links to recordings for auditor review

### 7.3: Customize Report Format

1. Click **Customize** or **Format**
2. Select columns to include:
   - ☑ User full name
   - ☑ User email
   - ☑ Secret name
   - ☑ Target system
   - ☑ Date/time (with timezone)
   - ☑ Duration
   - ☑ Source IP
   - ☑ Geographic location
   - ☑ Session recording link
   - ☑ Approval information (if workflow used)
3. Set grouping: **Group by User** or **Group by Cloud Platform**
4. Set sorting: **Sort by Date (newest first)**
5. Click **Apply**

---

## Step 8: Export Reports for Compliance

### 8.1: Export to PDF

1. With report generated, click **Export**
2. Select format: **PDF**
3. Configure PDF options:
   - Include cover page
   - Include summary statistics
   - Include company logo (if configured)
4. Click **Generate PDF**
5. Download file: `Cloud_Access_Report_Q1_2026.pdf`
6. Verify PDF contains:
   - Report title and date range
   - Summary metrics
   - Complete access log table
   - Session recording reference IDs

### 8.2: Export to CSV

1. Click **Export** again
2. Select format: **CSV**
3. Click **Generate CSV**
4. Download file: `Cloud_Access_Report_Q1_2026.csv`
5. Open in Excel/Sheets to verify:
   - All columns present
   - Data properly formatted
   - Timestamps in readable format
   - Can be filtered/sorted

### 8.3: Export to JSON (For SIEM Integration)

1. Click **Export**
2. Select format: **JSON**
3. JSON includes structured data:
```json
{
  "report": {
    "name": "Cloud Account Access Report - Q1 2026",
    "generated": "2026-02-15T10:30:00Z",
    "date_range": {
      "start": "2026-01-01T00:00:00Z",
      "end": "2026-03-31T23:59:59Z"
    },
    "sessions": [
      {
        "session_id": "abc123",
        "user": "john.doe@company.com",
        "secret": "AWS IAM Admin - prod",
        "target": "AWS Console",
        "start_time": "2026-02-01T09:15:00Z",
        "duration_seconds": 1680,
        "source_ip": "192.168.1.45",
        "recording_available": true
      }
    ]
  }
}
```
4. Use for ingestion into SIEM or compliance tools

---

## Step 9: Schedule Automated Reports

### 9.1: Create Scheduled Report

1. Navigate to **Insights → Reports**
2. Select the report you created
3. Click **Schedule**
4. Configure schedule:
   - **Frequency:** Monthly (first day of month)
   - **Time:** 6:00 AM
   - **Recipients:** compliance@company.com, security@company.com
   - **Format:** PDF and CSV
   - **Include recording links:** Yes
5. Click **Save Schedule**

### 9.2: Configure Report Distribution

1. Under **Distribution Settings**:
   - **Email subject:** `Monthly Cloud Access Compliance Report - [Month]`
   - **Email body:** Include summary text
   - **Attach files:** PDF and CSV
   - **Secure delivery:** Encrypt attachments (if available)
2. Click **Save**

---

## Step 10: Demonstrate Playback for Auditor

### 10.1: Prepare Demonstration Session

1. Navigate to **Insights → Session Review**
2. Find a representative session with typical activity:
   - User accessing AWS console
   - Performing common administrative tasks
   - Complete session (not interrupted)
3. Note session details for reference

### 10.2: Present Session to Auditor

Walk through demonstration:

1. **Show Session Metadata:**
   - "This session shows John Doe accessing AWS production console"
   - "Access occurred on February 1, 2026 at 9:15 AM"
   - "Session lasted 28 minutes"
   - "Access was from corporate IP: 192.168.1.45"

2. **Play Recording:**
   - Click Play button
   - "Here you can see the login process"
   - "Password is never visible to us or the user"
   - "User navigated to S3 service"
   - "Viewed bucket contents for 'app-logs-prod'"
   - "Did not download or delete any data"
   - "Signed out cleanly at 9:43 AM"

3. **Show Search Capability:**
   - "We can search for specific actions"
   - Search for "bucket"
   - "Instantly jumps to bucket access in recording"

4. **Demonstrate Audit Trail:**
   - "Every action is timestamped and linked to user identity"
   - "Recording cannot be altered or deleted by users"
   - "Retained for 90 days per compliance policy"

### 10.3: Answer Common Auditor Questions

**Q: Can users delete recordings?**
A: No, only Platform administrators can manage recordings, and deletion is logged.

**Q: Can recordings be altered?**
A: No, recordings are write-once and cryptographically verified.

**Q: How do you prove identity?**
A: Multi-factor authentication required before access, and all actions linked to authenticated user account.

**Q: Can you show me a specific user's activity?**
A: Yes (demonstrate user filter and show all their sessions).

**Q: What if someone uses shared credentials?**
A: Not possible - all credentials checked out to specific users, exclusive access via check-out, session recording links action to individual.

---

## Success Criteria Verification

Verify you have successfully completed UC-11:

- ✅ Session recording enabled for all cloud platform access
- ✅ Multiple recorded sessions available (AWS, GCP, Snowflake)
- ✅ Session Review dashboard accessed successfully
- ✅ Filtered sessions by platform (AWS/GCP/Snowflake)
- ✅ Filtered sessions by user
- ✅ Filtered sessions by date range
- ✅ Individual session details reviewed showing:
  - User who accessed (full identity)
  - Which account accessed (secret name)
  - When access occurred (timestamp)
  - Where access originated (source IP)
  - What they did (activity log/commands)
- ✅ Session recording played back successfully
- ✅ Video shows complete console/terminal session
- ✅ Playback controls tested (pause, skip, speed, search)
- ✅ Commands/actions searchable in recording
- ✅ Keystroke data captured (if enabled)
- ✅ Compliance report generated covering POC duration
- ✅ Report exported to PDF format
- ✅ Report exported to CSV format
- ✅ Report includes all required fields for compliance
- ✅ Report scheduled for automated monthly generation
- ✅ Session playback demonstrated to stakeholder/auditor
- ✅ All auditor questions answered satisfactorily

---