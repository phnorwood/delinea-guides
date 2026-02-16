# Use-Case: Secure SSH Session to Cloud Bastion Hosts

**Objective:** Onboard SSH key pairs used to access critical bastion/jump hosts in AWS or GCP. Users check out the SSH key from the Platform, and the Platform brokers the SSH session through PRA, recording all commands executed with keystroke logging.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- Platform Engine with PRA workload installed and active
- AWS or GCP bastion host accessible from Platform Engine
- SSH key pair for bastion host access
- Session recording enabled globally

**Estimated Time:** 45-60 minutes

---

## Step 1: Create Folder Structure for SSH Keys

1. Log in to Delinea Platform: `https://[your-tenant].delinea.app`
2. Navigate to **Secret Server → All Secrets**
3. Click **New Folder**
4. Create folder structure:
   ```
   SSH Keys
   ├── AWS Bastion Keys
   └── GCP Bastion Keys
   ```
   - Folder name: `SSH Keys`
   - Parent folder: Root level
   - Click **Create**
5. Create subfolders:
   - `AWS Bastion Keys` under `SSH Keys`
   - `GCP Bastion Keys` under `SSH Keys`

---

## Step 2: Generate or Obtain SSH Key Pair

### 2.1: Generate New SSH Key Pair (If Needed)

On your local machine or secure workstation:

```bash
# Generate new SSH key pair
ssh-keygen -t rsa -b 4096 -f bastion_key -C "platform-managed-key"

# This creates:
# - bastion_key (private key)
# - bastion_key.pub (public key)

# Set secure permissions
chmod 600 bastion_key
chmod 644 bastion_key.pub
```

### 2.2: Add Public Key to Bastion Host

**For AWS EC2 Bastion:**

1. Log in to AWS Console
2. Navigate to **EC2 → Instances**
3. Select your bastion host
4. Connect to instance (using existing access method)
5. Add public key to authorized_keys:

```bash
# On bastion host
echo "ssh-rsa AAAAB3NzaC1yc2EAAAA... platform-managed-key" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**For GCP Compute Engine Bastion:**

1. Log in to Google Cloud Console
2. Navigate to **Compute Engine → VM Instances**
3. Click on your bastion instance
4. Click **Edit**
5. Under **SSH Keys**, click **Add Item**
6. Paste your public key
7. Click **Save**

Or via gcloud CLI:
```bash
gcloud compute instances add-metadata [INSTANCE-NAME] \
  --metadata ssh-keys="[USERNAME]:$(cat bastion_key.pub)"
```

---

## Step 3: Store SSH Key Pair in Platform

### 3.1: Create SSH Key Secret

1. Navigate to **Secret Server → All Secrets**
2. Browse to folder: `/SSH Keys/AWS Bastion Keys` (or GCP)
3. Click **Create Secret**
4. Select template: **SSH Key**
5. Configure:
   - **Folder:** `/SSH Keys/AWS Bastion Keys`
   - **Secret Name:** `AWS Bastion - [Bastion-Name] - [Environment]`
   - **Host:** Bastion host IP or DNS (e.g., `bastion.example.com` or `54.123.45.67`)
   - **Username:** SSH username (e.g., `ec2-user`, `ubuntu`, or your username)
   - **Private Key:** Click **Upload File** and select `bastion_key`
     - Or paste private key content directly
   - **Passphrase:** Enter if key is encrypted (leave blank if not)
   - **Port:** `22` (default SSH port)
   - **Notes:** "Production bastion host for VPC access"
6. Click **Create Secret**

---

## Step 4: Configure SSH Key for Brokered Access

### 4.1: Enable Security Settings

1. Open the SSH key secret you just created
2. Click **Security** tab
3. Click **Edit**
4. Configure:
   - **☑ Require comment** (document reason for SSH access)
   - **☑ Session recording** (record all SSH commands)
   - **☑ Check out** (optional - enables exclusive access)
     - Check out interval: `2 hours`
   - **☑ Hide launcher password** (prevents viewing private key)
5. Click **Save**

### 4.2: Configure SSH Launcher Settings

1. Still in the secret, click **Settings** tab
2. Find **SSH Launcher** section
3. Click **Edit**
4. Configure:
   - **☑ Enable launcher**
   - **Launcher Type:** SSH (via Remote Access)
   - **Connection method:** Use PRA
   - **Host:** Verify populated from secret
   - **Port:** Verify `22`
5. Under **Advanced Settings**:
   - **☑ Enable command logging** (records commands executed)
   - **☑ Record session** (captures full session)
6. Click **Save**

---

## Step 5: Configure Session Recording for SSH

### 5.1: Verify Global SSH Recording Settings

1. Navigate to **Settings → Administration**
2. Search for and click **Session Recording**
3. Click **Edit**
4. Verify settings:
   - **☑ Enable session recording**
   - **☑ Record SSH sessions**
   - **☑ Record keystrokes** (captures commands)
   - **☑ Record SSH command metadata**
5. Click **Save**

### 5.2: Configure SSH Proxy Settings (Optional)

1. Navigate to **Settings → Administration**
2. Search for **SSH Proxy**
3. Click **Edit**
4. Configure:
   - **☑ Enable SSH proxy**
   - **☑ Log all commands**
   - **☑ Block dangerous commands** (optional)
     - Blocked commands: `rm -rf`, `dd if=`, `mkfs`
5. Click **Save**

---

## Step 6: Test SSH Connection via Platform

### 6.1: Launch SSH Session via PRA

1. Navigate to your bastion SSH key secret
2. Click **Open with Remote Access** (launcher button)
3. If prompted:
   - **Site:** Select your PRA site
   - Click **Continue**
4. A new browser tab opens with terminal session
5. PRA establishes SSH connection to bastion host
6. Verify you see:
   - Terminal prompt showing bastion host
   - Username@hostname in prompt
   - SSH connection established message

### 6.2: Verify SSH Connection

Once connected to bastion host:

```bash
# Verify current user
whoami

# Check hostname
hostname

# Verify network interface
ip addr show

# Check you can sudo (if applicable)
sudo whoami
```

Verify all commands are visible in the terminal.

---

## Step 7: Perform Test Operations and Verify Recording

### 7.1: Execute Sample Commands

In the SSH session, run the following commands:

```bash
# 1. Check system information
uname -a
cat /etc/os-release

# 2. Check disk space
df -h

# 3. List running processes
ps aux | head -20

# 4. Check network connections
netstat -tuln | head -10

# 5. View system logs (if permissions allow)
sudo tail -20 /var/log/syslog

# 6. Create test file
echo "Test from Platform SSH session - $(date)" > /tmp/platform-test.txt
cat /tmp/platform-test.txt

# 7. Clean up
rm /tmp/platform-test.txt
```

All these commands are being recorded.

### 7.2: End SSH Session

```bash
# Exit the SSH session
exit
```

The browser terminal session closes and returns to Platform.

---

## Step 8: Review SSH Session Recording

### 8.1: Locate Session Recording

1. As administrator, navigate to **Insights → Session Review**
2. Find the SSH session:
   - Filter by **Protocol:** SSH
   - Filter by **Secret:** Your bastion SSH key secret
   - Filter by **Date:** Today
3. Click on the session
4. Verify session details:
   - **User:** Your username
   - **Secret:** Bastion SSH key secret name
   - **Host:** Bastion host address
   - **Duration:** Session length
   - **Status:** Completed

### 8.2: Review Session Activity and Commands

1. Click **Activity** or **Commands** tab
2. Review captured commands with timestamps:
   - `whoami` - [timestamp]
   - `hostname` - [timestamp]
   - `uname -a` - [timestamp]
   - `df -h` - [timestamp]
   - `ps aux | head -20` - [timestamp]
   - `sudo tail -20 /var/log/syslog` - [timestamp]
   - `echo "Test from Platform..."` - [timestamp]
   - `exit` - [timestamp]
3. Verify each command is logged with:
   - Exact command text
   - Timestamp
   - User who executed it

### 8.3: Play Back Session Video

1. Click **Play** button to watch video recording
2. Video player loads with terminal session
3. Verify recording shows:
   - SSH connection establishment
   - Terminal prompt
   - Each command being typed
   - Command output displayed
   - Exit command
4. Use playback controls:
   - **Search:** Search for specific commands (e.g., "sudo")
   - **Jump:** Click command in activity log to jump to that point
   - **Speed:** Adjust playback speed

---

## Step 9: Configure Command Filtering and Alerts

### 9.1: Create Alert for Privileged Commands

1. Navigate to **Settings → Administration**
2. Search for **Event Subscriptions**
3. Click **Create Subscription**
4. Configure:
   - **Subscription Name:** `SSH Privileged Command Alert`
   - **Event Type:** Command Executed
   - **Filter by command pattern:** Contains `sudo` or `rm -rf`
   - **Filter by secret folder:** `/SSH Keys`
   - **Alert method:** Email
   - **Recipients:** Security team email
5. Click **Save**

### 9.2: Create Alert for Bastion Access

1. Click **Create Subscription** again
2. Configure:
   - **Subscription Name:** `Bastion Host SSH Access`
   - **Event Type:** Session Started
   - **Filter by protocol:** SSH
   - **Filter by secret folder:** `/SSH Keys/AWS Bastion Keys`
   - **Alert method:** Email
   - **Recipients:** Security team and network admin
3. Click **Save**

---

## Step 10: Configure Access Controls and Approval Workflow

### 10.1: Create Bastion Access Approval Workflow (Optional)

1. Navigate to **Settings → Administration**
2. Search for **Approval Workflows**
3. Click **Create Workflow**
4. Configure:
   - **Workflow Name:** `Bastion SSH Access Approval`
   - **Description:** `Required approval for bastion host SSH access`
5. Click **Next**
6. Click **Add Step**
7. Configure:
   - **Step Name:** `Network Admin Approval`
   - **Approvers:** Select network admin group
   - **Required Approvals:** `1`
   - **Approval Duration:** `4 hours`
8. Click **Add**
9. Click **Save**

### 10.2: Apply Workflow to Bastion SSH Key

1. Return to your bastion SSH key secret
2. Click **Security** tab
3. Click **Edit**
4. Configure:
   - **☑ Require approval for access**
   - **Approval Workflow:** Select `Bastion SSH Access Approval`
5. Click **Save**

### 10.3: Grant User Access to SSH Key

1. Still in **Security** tab, scroll to **Permissions**
2. Click **Edit Permissions**
3. Click **Add**
4. Configure:
   - **User/Group:** Select users or groups needing bastion access
   - **Role:** Select **View** (sufficient for SSH access)
5. Click **Save**

---

## Step 11: Test Approval Workflow for SSH Access

### 11.1: Request Bastion Access (As User)

1. Log out and log in as regular user
2. Navigate to **Secret Server → All Secrets**
3. Browse to `/SSH Keys/AWS Bastion Keys`
4. Click on bastion SSH key secret
5. Click **Request Access**
6. Fill out request:
   - **Reason:** "Need to troubleshoot application connectivity issue on private subnet servers"
   - **Duration:** `1 hour`
7. Click **Submit Request**
8. Verify: "Access request pending approval"

### 11.2: Approve Request (As Network Admin)

1. Log in as network admin (or approver)
2. Navigate to **Access → Requests**
3. Find the bastion access request
4. Click **Review**
5. Review details and justification
6. Click **Approve**
7. Add comment: "Approved for connectivity troubleshooting"
8. Click **Submit**

### 11.3: Access Bastion and Verify Recording

1. Log back in as requesting user
2. Navigate to bastion SSH key secret
3. Click **Open with Remote Access**
4. SSH session launches via PRA
5. Perform troubleshooting commands
6. Exit session
7. Verify session is recorded with all commands logged

---

## Step 12: Create SSH Access Audit Report

### 12.1: Generate SSH Access Report

1. As administrator, navigate to **Insights → Reports**
2. Select or create report: **SSH Session Report**
3. Configure filters:
   - **Protocol:** SSH
   - **Secret Folder:** `/SSH Keys`
   - **Date Range:** Last 30 days
4. Click **Run Report**
5. Review report data:
   - Date/time of each SSH session
   - User who accessed bastion
   - Bastion host accessed
   - Session duration
   - Commands executed (summary)

### 12.2: Export SSH Audit Report

1. Click **Export**
2. Select format: **CSV** or **PDF**
3. Save file
4. Verify report includes:
   - Username
   - Timestamp
   - Bastion host
   - Commands executed
   - Session recording reference

---

## Step 13: Configure Additional Bastion Hosts

### 13.1: Add Additional SSH Keys

For each additional bastion host:

1. Generate or obtain SSH key pair for the bastion
2. Add public key to bastion host's authorized_keys
3. Create new secret in appropriate folder:
   - AWS bastions: `/SSH Keys/AWS Bastion Keys`
   - GCP bastions: `/SSH Keys/GCP Bastion Keys`
4. Configure same security settings:
   - Require comment
   - Session recording
   - Check out (optional)
   - Approval workflow (if required)
5. Test connection and verify recording

### 13.2: Document Bastion Inventory

Create documentation for each bastion:

**Bastion Inventory:**
- **Name:** Production AWS Bastion
- **Platform Secret:** `/SSH Keys/AWS Bastion Keys/AWS Bastion - Prod - us-east-1`
- **Host:** bastion-prod.example.com
- **Purpose:** Access to production VPC private subnets
- **Approval Required:** Yes
- **Approvers:** Network Admin team
- **Allowed Users:** DevOps, SRE teams
- **Recording:** All commands logged

---

## Success Criteria Verification

- ✅ SSH key pairs for bastion hosts stored in Platform vault
- ✅ Private keys secured with appropriate access controls
- ✅ Public keys added to bastion hosts' authorized_keys
- ✅ SSH launcher configured to use PRA
- ✅ Session recording enabled for SSH sessions
- ✅ Keystroke logging captures all commands executed
- ✅ Administrator checked out SSH key from Platform
- ✅ PRA brokered SSH session to bastion host
- ✅ Connection established successfully
- ✅ Commands executed in SSH session (whoami, df, ps, etc.)
- ✅ All commands logged with timestamps
- ✅ Session recording captured full terminal session
- ✅ Video playback available showing terminal activity
- ✅ Command search functionality works (can find specific commands)
- ✅ Privileged commands (sudo) flagged in activity log
- ✅ Audit trail shows user, timestamp, host, and commands
- ✅ Approval workflow tested (if configured)
- ✅ Security alerts configured for sensitive commands
- ✅ Compliance report generated with SSH access history

---
