# Delinea Platform Use Cases Guide

**Configuration Guide for Common Deployment Scenarios**

---

## Table of Contents

1. [Onboard Active Directory Users](#onboard-active-directory-users)
2. [Discovery and Import](#discovery-and-import)
3. [Secret Vaulting with Security Controls](#secret-vaulting-with-security-controls)
4. [Employee Privileged Remote Access](#employee-privileged-remote-access)
5. [Vendor Privileged Remote Access](#vendor-privileged-remote-access)
6. [Protocol Handlers (RDP & PuTTY)](#protocol-handlers-rdp--putty)
7. [SQL Server Account Management](#sql-server-account-management)
8. [Connection Manager](#connection-manager)
9. [Remote Applications](#remote-applications)
10. [Web Applications](#web-applications)
11. [Shared Secrets](#shared-secrets)

---

## Onboard Active Directory Users

### Business Context
Organizations need to integrate their existing Active Directory user base into the Delinea Platform for authentication and authorization. This eliminates the need to create duplicate accounts and leverages existing directory infrastructure. Users authenticate with their AD credentials and inherit permissions based on AD group membership. This streamlines user management and ensures consistency across systems.

### Configuration Steps

1. Navigate to **Access → Users**
2. Click **More → Invite Users**
3. Select **Active Directory: [your-domain]** as the source
4. Search for users by name or group
5. Select the users to invite
6. Assign appropriate groups:
   - **System Administrator**: Full platform access
   - **User**: Standard access with limited permissions
   - **Privilege Manager**: Manages secrets and access policies
7. Click **Next**
8. Review the invitation summary
9. Click **Invite Users**
10. Users will receive an email invitation to complete setup

**Note:** Users must accept the invitation and configure MFA (if required) before accessing the platform.

---

## Discovery and Import

### Business Context
Discovery automates the identification of privileged accounts across your infrastructure, reducing manual inventory efforts. This use case enables administrators to quickly locate and vault discovered accounts. Regular discovery scans help maintain an accurate inventory of privileged credentials and identify shadow accounts or orphaned credentials that pose security risks.

### Configuration Steps

#### Import Domain Admin Accounts

1. Navigate to **Discovery → Network View**
2. In the **Item type** filter, select **Directory account**
3. Search or filter for domain admin accounts
4. Select the account(s) to import
5. Click **Import**
6. Configure import settings:
   - **Site:** Select your site
   - **Secret template:** Active Directory Account
   - **Folder:** `/Secrets/Active Directory/Admin Accounts`
   - **Secret Name:** Keep default (`domain\username`)
7. Click **Next**
8. Select password takeover method:
   - **Generate a random password for each account** (recommended)
   - Select **Initial takeover secrets:** Choose password changer account
9. Click **Next**
10. Select **Password changing privileged account:** Choose password changer account
11. Click **Import**

#### Import Service Accounts

1. Navigate to **Discovery → Network View**
2. In the **Item type** filter, select **Service account**
3. Select the account(s) to import
4. Click **Import**
5. Configure:
   - **Folder:** `/Secrets/Active Directory/Service Accounts`
   - **Secret template:** Active Directory Account
6. Click **Next**
7. Select **I know the current password and do not want to change it**
8. Click **Next**
9. Enter the current password
10. Click **Next**
11. Click **Import**

#### Import Local Administrator Accounts

1. Navigate to **Discovery → Network View**
2. In the **Item type** filter, select **Computer account**
3. Select the local administrator account(s)
4. Click **Import**
5. Configure:
   - **Folder:** `/Secrets/Local Accounts`
   - **Secret template:** Windows Account
6. Follow steps 7-11 from Domain Admin import process

#### Import Windows Services

1. Navigate to **Discovery → Network View**
2. In the **Item type** filter, select **Windows Service**
3. Select the service(s) to import
4. Click **Import**
5. Configure:
   - **Folder:** `/Secrets/Active Directory/Service Accounts`
   - **Password takeover:** Generate random password
   - **Dependency Template:** Windows Service
   - **Restart on Change:** Checked
6. Complete the import process

---

## Secret Vaulting with Security Controls

### Business Context
Vaulting applies security policies to privileged credentials to enforce accountability and reduce risk. Security controls like requiring comments, hiding passwords, enabling MFA, and implementing check-out prevent unauthorized access and provide audit trails. These controls ensure that privileged access is tracked, temporary, and requires explicit justification, meeting compliance requirements and security best practices.

### Configuration Steps

#### Require Comment for Access

1. Navigate to **Secret Server**
2. Open the desired secret
3. Click **Security**
4. Click **Edit**
5. Enable **Require comment**
6. Click **Save**

**Result:** Users must provide a business justification comment before accessing the secret.

#### Hide Launcher Password

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable **Hide launcher password**
5. Click **Save**

**Result:** Password is not displayed to users; they can only use launchers to access systems.

#### Enable Multi-Factor Authentication

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable **Multifactor authentication**
5. Click **Save**

**Result:** Users must complete MFA challenge before accessing the secret.

#### Enable Check Out

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable **Check out**
5. Configure **Check-out interval** (e.g., 30 minutes, 1 hour, 4 hours)
6. Click **Save**

**Result:** Only one user can access the secret at a time; password automatically rotates after check-in.

#### Enable Session Recording

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable **Session recording enabled**
5. Click **Save**

**Result:** All sessions launched with this secret are recorded for audit purposes.

#### Combine Multiple Security Controls

To create a highly secured secret with all controls:

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable all desired controls:
   - ☑ Require comment
   - ☑ Hide launcher password
   - ☑ Multifactor authentication
   - ☑ Check out
   - ☑ Session recording enabled
5. Click **Save**

#### Enable Approval Workflows

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable **Approval**
5. Select or create an approval workflow
6. Click **Save**

**Result:** Users must request access and receive approval before accessing the secret.

---

## Employee Privileged Remote Access

### Business Context
Privileged Remote Access (PRA) enables employees to access remote systems through a web browser without VPN or exposing credentials. Sessions are brokered through the Delinea Platform, providing centralized access control, session recording, and audit logging. This eliminates the need for shared credentials and provides a secure, trackable method for privileged access to servers and workstations.

### Configuration Steps

#### Configure Secret for PRA

1. Navigate to **Secret Server**
2. Open an Active Directory or Windows Account secret
3. Click **Settings**
4. Find **RDP launcher** section
5. Click **Edit**
6. Configure options:
   - Enable **Allow access to clipboard** (if needed)
   - Enable **Connect to console session** (if needed)
7. Click **Save**

#### Launch PRA Session

1. Open the secret
2. Click **Launch** or **Open with Remote Access**
3. In the launch dialog:
   - Enter the **target computer name** or **IP address**
   - Or select from recently used targets
4. Click **Continue**
5. The remote session opens in your browser
6. Access the remote system securely

#### Use PRA Features During Session

**File Transfer:**
1. During an active PRA session, click the Delinea icon (upper right)
2. Click **Transfer Files**
3. Navigate to the destination folder
4. Click **Upload** to transfer files to the remote system
5. Select files to upload
6. Click **Open**
7. Monitor transfer progress in the queue

**Clipboard:**
1. Click the Delinea icon (upper right)
2. Click **Clipboard**
3. Paste content into the clipboard window
4. Click **Send to Server Clipboard**
5. Right-click in the remote session to paste

**End Session:**
1. Close the browser tab, or
2. Log out of the remote system normally

#### Review Session Recordings

1. Navigate to **Activity → Session Recording**
2. Filter by date, user, or secret
3. Click on a session to view details
4. Click **Play** to watch the recording
5. Use playback controls to review specific actions

---

## Vendor Privileged Remote Access

### Business Context
Vendor access requires different security controls than employee access, typically including time-limited access, additional approval requirements, and enhanced monitoring. Organizations need to provide temporary, controlled access to external contractors while maintaining strict oversight. This use case demonstrates how to configure PRA for vendor users with appropriate restrictions and audit capabilities.

### Configuration Steps

#### Create Vendor User Account

1. Navigate to **Access → Users**
2. Click **Add Local User**
3. Configure:
   - **Username:** `vendor.firstname.lastname@[tenant-hostname]`
   - **Email:** Vendor's email address
   - **Display name:** Vendor name and company
4. Click **Next**
5. Select **Membership type: Vendor**
6. Click **Next**
7. Assign to **User** group (or custom vendor group)
8. Click **Add**

#### Grant Vendor Access to Specific Secrets

1. Navigate to **Secret Server**
2. Open the secret the vendor needs
3. Click **Sharing**
4. Click **Share**
5. Search for the vendor user
6. Select the user
7. Configure permissions:
   - **View:** Allows viewing secret details
   - **Edit:** Allows editing secret (typically not granted)
   - **Owner:** Full control (typically not granted)
8. Click **Share**

#### Configure Time-Limited Access (Optional)

1. Open the shared secret
2. Click **Security**
3. Click **Edit**
4. Enable **Check out**
5. Set a short check-out interval (e.g., 1 hour)
6. Enable **Approval** workflow for vendor access
7. Click **Save**

#### Configure Enhanced Monitoring

1. Ensure **Session recording enabled** is turned on
2. Enable **Require comment**
3. Enable **Multifactor authentication**
4. Consider enabling **Approval** for each access

#### Revoke Vendor Access

When vendor engagement ends:

1. Open the secret
2. Click **Sharing**
3. Find the vendor user
4. Click **Unshare**
5. Confirm removal

Or disable the vendor user account:

1. Navigate to **Access → Users**
2. Find the vendor user
3. Click **More → Disable User**

---

## Protocol Handlers (RDP & PuTTY)

### Business Context
Protocol handlers enable direct launching of RDP and SSH sessions from the Delinea Platform to local desktop applications. This provides a more traditional user experience for administrators who prefer native tools over web-based sessions. Protocol handlers automatically inject credentials without exposing them to the user, maintaining security while improving usability for power users who require advanced features of native clients.

### Configuration Steps

#### Download and Install Protocol Handler

1. Navigate to **Settings → Administration**
2. Search for **Launcher tools**
3. Click **Launcher tools**
4. Download the appropriate version:
   - **Download protocol handler (64-bit)** - For 64-bit Windows
   - **Download protocol handler (32-bit)** - For 32-bit Windows
5. Run the installer as Administrator on the client workstation
6. Follow the installation wizard
7. Close all browser windows after installation

#### Configure RDP Launcher

1. Navigate to **Secret Server**
2. Open a Windows or Active Directory account secret
3. Click **Settings**
4. Find **RDP launcher**
5. Click **Edit**
6. Configure:
   - **Allow access to clipboard:** Enable if needed
   - **Connect to console session:** Enable if needed
   - **Use SSL:** Enable for encrypted connections
7. Click **Save**

#### Configure PuTTY Launcher (SSH)

1. Ensure you have a **Unix Account (SSH)** secret
2. Open the secret
3. Click **Settings**
4. Find **PuTTY launcher**
5. Click **Edit**
6. Configure:
   - **Port:** 22 (or custom SSH port)
   - **Additional arguments:** Any custom PuTTY parameters
7. Click **Save**

#### Launch Using Protocol Handler

**For RDP:**
1. Open the Windows account secret
2. Click **Launch**
3. Select **RDP** from the launcher options
4. The RDP session opens in your local Remote Desktop client

**For PuTTY:**
1. Open the Unix account secret
2. Click **Launch**
3. Select **PuTTY** from the launcher options
4. The SSH session opens in your local PuTTY client

**Note:** The protocol handler must be installed on each workstation where users will launch sessions.

---

## SQL Server Account Management

### Business Context
SQL Server accounts require specialized management including password rotation and custom launchers for database connections. Database administrators need secure access to SQL instances without manual password entry. This use case enables automatic password management for SQL accounts while providing direct connectivity through SQL Server Management Studio (SSMS) or custom database tools.

### Configuration Steps

#### Create SQL Server Account Secret

1. Navigate to **Secret Server**
2. Navigate to the desired folder
3. Click **Create Secret**
4. Select template: **SQL Server Account**
5. Configure:
   - **Secret name:** `ServerName\SQLAccount`
   - **Server:** SQL Server hostname or IP
   - **Username:** SQL account username
   - **Password:** SQL account password
   - **Database:** Default database (optional)
6. Click **Create Secret**

#### Enable Remote Password Changing for SQL Account

1. Open the SQL Server account secret
2. Click **Remote Password Changing**
3. Click **Edit**
4. Configure:
   - **Change password using:** Privileged account credentials
   - **Change password using:** Select a privileged SQL account
   - Enable **Auto Change Enabled**
5. Set **Auto Change Schedule** (e.g., 30 days)
6. Click **Save**

#### Test Password Rotation

1. Open the secret
2. Click **Change password now**
3. Select **Randomly generated**
4. Click **Change password**
5. Verify the password was changed successfully
6. Check **Heartbeat** status to confirm connectivity

#### Configure SQL Server Launcher (SSMS)

1. Open the SQL Server account secret
2. Click **Settings**
3. Find **SQL Server launcher**
4. Click **Edit**
5. Configure:
   - **Server:** Hostname or IP
   - **Database:** Default database
   - **Use Integrated Security:** Unchecked (for SQL authentication)
6. Click **Save**

#### Launch SQL Server Management Studio

1. Open the SQL Server account secret
2. Click **Launch**
3. Select **SQL Server Management Studio**
4. SSMS opens with credentials automatically populated
5. Click **Connect**

**Note:** SQL Server Management Studio must be installed on the user's workstation.

#### Create Custom Launcher (Optional)

For custom database tools:

1. Navigate to **Settings → Administration**
2. Search for **Launcher Types**
3. Click **Create Launcher Type**
4. Configure:
   - **Name:** Custom Database Tool
   - **Launcher Type:** Process
   - **Process Name:** Path to executable (e.g., `C:\Program Files\Tool\tool.exe`)
   - **Process Arguments:** Use tokens like `$USERNAME`, `$PASSWORD`, `$SERVER`
5. Click **Save**
6. Assign the custom launcher to the secret template

---

## Connection Manager

### Business Context
Connection Manager provides a centralized interface for launching multiple connections and managing active sessions. IT administrators often need to connect to numerous systems throughout the day, and Connection Manager streamlines this workflow by providing a single dashboard for all privileged access. This improves productivity and provides a consistent experience across different connection types.

### Configuration Steps

#### Download and Install Connection Manager

1. Navigate to **Settings → Administration**
2. Search for **Connection Manager**
3. Click the **Connection Manager** link
4. Download the installer for Windows
5. Run the installer as Administrator on the user's workstation
6. Follow the installation wizard
7. Launch Connection Manager after installation

#### Configure Connection Manager

1. Open Connection Manager on your workstation
2. Click **Settings** (gear icon)
3. Configure:
   - **Tenant URL:** `https://[your-tenant].delinea.app`
   - **Auto-launch:** Enable if desired
   - **Minimize to tray:** Enable if desired
4. Click **Save**

#### Authenticate to Connection Manager

1. Click **Sign In**
2. Enter your Delinea Platform credentials
3. Complete MFA if required
4. Connection Manager connects to your tenant

#### Browse and Launch Connections

1. In Connection Manager, browse the folder tree
2. Folders mirror your Secret Server folder structure
3. Click on a secret to view details
4. Click **Connect** to launch a session
5. Select the connection type:
   - **RDP** - Remote Desktop
   - **PuTTY** - SSH
   - **SQL Server** - SSMS
   - **Web** - Browser-based

#### Manage Active Sessions

1. View active sessions in the **Active Sessions** tab
2. Click on a session to:
   - **Switch to** - Bring session to foreground
   - **Disconnect** - End the session
3. Session recordings are still captured

#### Search for Secrets

1. Use the **Search** bar at the top
2. Enter keywords to find secrets quickly
3. Results display across all accessible folders
4. Click a result to view details or connect

**Note:** Connection Manager requires the Protocol Handler to be installed for RDP and PuTTY connections.

---

## Remote Applications

### Business Context
Remote applications allow users to access published applications through the Delinea Platform without full desktop access. This limits user exposure to only necessary applications, reducing security risk. IT can publish specific tools or applications that require privileged access, providing a streamlined experience. This is ideal for scenarios where users need access to one or two applications rather than full server access.

### Configuration Steps

#### Prerequisites
- Remote Desktop Services (RDS) or similar published app infrastructure must be configured
- Applications must be published and available
- Platform Engine with PRA workload installed

#### Add Remote Application

1. Navigate to **Inventory → Remote Applications**
2. Click **Add Remote Application**
3. Configure:
   - **Application Name:** Descriptive name (e.g., "WordPad on RDS")
   - **Application alias:** Short identifier (e.g., "wordpad")
   - **Login secret:** Select secret with access to RDS
   - **Target/DNS:** RDS server hostname or IP
4. Click **Save**

#### Configure Remote Application Details

1. Open the remote application
2. Click **Edit**
3. Configure additional settings:
   - **Description:** Purpose of the application
   - **Site:** Select appropriate site
   - **Icon:** Upload custom icon (optional)
4. Click **Save**

#### Grant User Access to Remote Application

1. Navigate to **Access → Roles**
2. Create or edit a role
3. Under **Permissions**, add:
   - **Remote Application Access**
   - Select specific applications
4. Assign users to the role

#### Launch Remote Application

1. Users navigate to **Inventory → Remote Applications**
2. Click on the application name
3. Click **Launch Application**
4. The application opens in a new browser window
5. Users interact with the application directly
6. Close the window when finished

#### Monitor Remote Application Usage

1. Navigate to **Activity → Session Recording**
2. Filter by **Remote Application**
3. View session details and recordings
4. Review audit logs for compliance

---

## Web Applications

### Business Context
Web applications provide secure, browser-based access to internal web services through the Delinea Platform. This eliminates the need for VPN connections while providing centralized access control and audit logging. Users can access internal web portals, management consoles, and other web-based tools through a secure gateway. All traffic is routed through the Platform Engine, protecting internal resources from direct exposure.

### Configuration Steps

#### Add Web Application

1. Navigate to **Inventory → Web Applications**
2. Click **Add Web Application**
3. Configure:
   - **Application Name:** Descriptive name (e.g., "IIS Admin Portal")
   - **Private URL:** Internal URL (e.g., `https://internalserver/admin`)
   - **Public URL prefix:** Short identifier (e.g., "iis-admin")
   - **Site:** Select site where Platform Engine is installed
4. Click **Save**

#### Configure Authentication (Optional)

1. Open the web application
2. Click **Edit**
3. Configure authentication:
   - **Authentication:** None, Basic, or Form-based
   - If using credentials, select **Login secret**
4. Configure **HTTP headers** if needed (optional)
5. Click **Save**

#### Grant User Access

1. Navigate to **Access → Roles**
2. Create or edit a role
3. Add permission: **Web Application Access**
4. Select specific web applications
5. Assign users to the role

#### Launch Web Application

1. Users navigate to **Inventory → Web Applications**
2. Click on the application name
3. Click **Launch Web Application**
4. A new browser tab opens with the application
5. If authentication is configured, credentials are injected automatically
6. Users interact with the web application normally

#### Access via Direct URL (Optional)

Users can bookmark the direct URL:
```
https://[your-tenant].delinea.app/app/[public-url-prefix]
```

Example:
```
https://contoso.delinea.app/app/iis-admin
```

#### Monitor Web Application Usage

1. Navigate to **Activity → Audit**
2. Filter for **Web Application** events
3. Review access logs:
   - Who accessed which application
   - When access occurred
   - Duration of session

---

## Shared Secrets

### Business Context
Shared secrets enable controlled, temporary access to privileged credentials for specific business needs. This use case demonstrates how to configure secrets that employees can access with appropriate security controls while maintaining accountability. Organizations use this pattern for shared administrative accounts, break-glass scenarios, or managed vendor access where multiple authorized users need time-limited access to the same credentials.

### Configuration Steps

#### Create Folder Structure for Shared Secrets

1. Navigate to **Secret Server**
2. Create a folder: `/Shared Secrets`
3. Create subfolders as needed:
   - `/Shared Secrets/Production`
   - `/Shared Secrets/Break-Glass`
   - `/Shared Secrets/Vendor Access`

#### Create Shared Secret with Security Controls

1. Navigate to `/Shared Secrets` folder
2. Click **Create Secret**
3. Select appropriate template (e.g., **Active Directory Account**)
4. Configure basic settings:
   - **Secret name:** Descriptive name
   - **Domain/Server:** Target system
   - **Username:** Account username
   - **Password:** Account password
5. Click **Create Secret**

#### Configure Security Controls

Apply all recommended controls:

1. Open the secret
2. Click **Security**
3. Click **Edit**
4. Enable:
   - ☑ **Require comment** - Users must justify access
   - ☑ **Hide launcher password** - Password not visible
   - ☑ **Multifactor authentication** - Additional verification
   - ☑ **Check out** - Exclusive access, auto-rotate after
   - ☑ **Session recording enabled** - Record all sessions
5. Configure **Check-out interval:** 30-60 minutes recommended
6. Click **Save**

#### Configure Password Rotation

1. Click **Remote Password Changing**
2. Click **Edit**
3. Configure:
   - **Change password using:** Privileged account credentials
   - **Change password using:** Select password changer account
   - Enable **Auto Change Enabled**
   - Enable **Change password on check in**
4. Click **Save**

#### Grant Group Access

1. Click **Sharing**
2. Click **Share**
3. Search for Active Directory group (e.g., "Domain Admins")
4. Select the group
5. Set permissions:
   - **View** - Standard access
   - **Edit** - Allow password changes (optional)
6. Click **Share**

#### Configure Approval Workflow (Recommended)

1. Click **Security**
2. Click **Edit**
3. Enable **Approval**
4. Configure workflow:
   - **Approvers:** Select manager or security team
   - **Require** - All approvers or any approver
5. Click **Save**

#### User Workflow for Accessing Shared Secret

**Request Access:**
1. User navigates to the shared secret
2. User enters required **comment** explaining need
3. If approval required, user submits request
4. Approver receives notification
5. Approver reviews and approves/denies

**Use Secret:**
1. User completes MFA challenge
2. Secret is checked out to user (exclusive access)
3. User launches session via PRA
4. Session is recorded
5. User completes work

**Check In:**
1. User clicks **Check In** when finished
2. Password automatically rotates
3. New password is not visible to user
4. Next user can check out with new password

#### Monitor Shared Secret Usage

1. Navigate to **Reports → Audit**
2. Filter by secret name
3. Review:
   - Who accessed the secret
   - When access occurred
   - Comments provided
   - Approval details
   - Session recordings

#### Best Practices

- Set short check-out intervals (30-60 minutes)
- Always enable password change on check-in
- Require comments for all access
- Enable approval workflows for highly sensitive secrets
- Review audit logs regularly
- Limit shared secret use to necessary scenarios only

---