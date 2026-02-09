# Delinea Platform Deployment Guide

**Quick Start Guide for Basic Environments e.g. POC, Non-Production**

This guide is not definitive, and not recommended for production environments.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture)
4. [Initial Setup](#initial-setup)
5. [Installing Core Components](#installing-core-components)
6. [Configuring Discovery](#configuring-discovery)
7. [Enabling Security Features](#enabling-security-features)
8. [Setting Up Privileged Remote Access](#setting-up-privileged-remote-access)
9. [Next Steps](#next-steps)

---

## Overview

This guide walks you through deploying the Delinea Platform in your Windows environment with Active Directory integration. You'll install and configure the essential components needed for privileged access management, identity protection, and secure remote access.

**Estimated Time:** 2-3 hours

**What You'll Deploy:**
- Delinea Platform tenant (cloud-based)
- Platform Engine with workloads (PRA, ITP, PCCE)
- Distributed Engine
- Delinea Connector for AD integration

---

## Prerequisites

### System Requirements Checklist

**Active Directory Environment:**
- [ ] Active Directory Domain Services configured
- [ ] Domain Admin credentials available
- [ ] DNS properly configured

**Windows Server (for Platform Engine & Distributed Engine):**
- [ ] Windows Server 2016 or later
- [ ] 4 CPU cores minimum
- [ ] 8 GB RAM minimum
- [ ] 50 GB available storage
- [ ] .NET Framework 4.7.2 or later
- [ ] Network access to delinea.com (port 443)
- [ ] Domain-joined server

**Active Directory Service Accounts (to be created):**
- [ ] Discovery account (read access to AD)
- [ ] Password changer account (password reset permissions)
- [ ] ITP account (read access to AD and domain computers)

**Administrator Access:**
- [ ] Local Administrator on target servers
- [ ] Domain Administrator credentials
- [ ] Access to Delinea Platform tenant (provided by Delinea)

**Network Requirements:**
- [ ] Outbound HTTPS (443) access to *.delinea.com
- [ ] RDP access between Platform Engine and target systems
- [ ] SMB access for Windows discovery

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Delinea Platform (Cloud)                │
│  - Secret Server                                │
│  - Identity Protection                          │
│  - Access Management                            │
└────────────────┬────────────────────────────────┘
                 │ HTTPS (443)
                 │
    ┌────────────┴────────────┐
    │                         │
┌───┴──────────────┐  ┌──────┴─────────────┐
│ Delinea Connector│  │ Platform Engine    │
│ - AD Integration │  │ - PRA Workload     │
│                  │  │ - ITP Workload     │
└──────────────────┘  │ - PCCE Workload    │
                      └────────────────────┘
                               │
                      ┌────────┴────────┐
                      │                 │
              ┌───────┴────────┐ ┌─────┴────────────┐
              │ Distributed    │ │ Target Systems   │
              │ Engine         │ │ - Windows Servers│
              │ - Discovery    │ │ - Workstations   │
              │ - Password Mgmt│ │                  │
              └────────────────┘ └──────────────────┘
```

---

## Initial Setup

### 1. Create Service Accounts in Active Directory

Create three service accounts in Active Directory with the following configurations:

**Discovery Account (e.g., svc_del_discovery):**
- Member of: Domain Users
- Permissions: Read access to all OUs you want to discover
- Password: Set to never expire

**Password Changer Account (e.g., svc_del_changer):**
- Member of: Account Operators (or custom group with password reset rights)
- Permissions: Reset password and force password change
- Password: Set to never expire

**ITP Account (e.g., svc_del_itp):**
- Member of: Domain Users
- Permissions: Read access to AD and local administrator on domain computers
- Password: Set to never expire

### 2. Access Your Delinea Platform Tenant

1. Open the welcome email from Delinea
2. Click the activation link
3. Set up your `cloudadmin` account password
4. Enable multi-factor authentication (recommended)

### 3. Create Platform Administrator Account

1. Log in to your tenant: `https://[your-tenant].delinea.app`
2. Navigate to **Access → Users**
3. Click **Add Local User**
   - Username: `[firstname.lastname]@[tenant-hostname]`
   - Email: Your email address
   - Display name: Your name
4. Click **Next**
5. Select **Membership type: Employee**
6. Click **Next**
7. Select **Group: System Administrator**
8. Click **Add**
9. Check your email and complete account setup

### 4. Configure Folder Structure

1. Navigate to **Secret Server**
2. Click **Continue** (first-time setup)
3. Create the following folder structure:

```
Root
├── Secrets
│   ├── Active Directory
│   │   ├── Admin Accounts
│   │   ├── Service Accounts
│   │   └── Discovery Accounts
│   └── Local Accounts
└── Shared Secrets
```

---

## Installing Core Components

### Step 1: Create a Site + Install Platform Engine

**On your designated Windows Server:**
1. Navigate to **Settings → Engine Management**
2. Click **Create Site**
   - Site Name: `Primary-DataCenter` (or your preferred name)
   - Description: `Primary on-premises location`
3. Click **Save**
4. In the Delinea Platform, navigate to **Settings → Engine Management**
5. Click on your site name
6. Click **Engines → Add Engine**
7. Select:
   - Operating system: **Windows**
   - Capabilities:
     - ☑ Active Directory Rapid Discovery
     - ☑ Audit Collector
     - ☑ ITP For Active directory
     - ☑ Privilege Control for Servers
     - ☑ Privileged Remote Access
8. Click **Generate Script**
9. Click **Copy PowerShell Script**
10. On the Windows Server:
   - Right-click PowerShell icon → **Run as Administrator**
   - Paste the script
   - Press Enter
11. Wait for installation to complete (~5 minutes)
12. Verify installation:
   - Return to **Settings → Engine Management → [Your Site] → Engines**
   - Your server should appear with status: **Active**

### Step 2: Create a Site + Install Distributed Engine

**On the same or different Windows Server:**

1. Navigate to **Settings → Administration**
2. Search for **Distributed Engine**
3. Click **Create Site**
   - Site Name: `Primary-DataCenter` (or your preferred name)
   - ☑ Active
   - Description: `Primary on-premises location`
   - Site Connector: `(Default)`
   - Engine Callback Interval: `300` (Default)
4. Click **Add Site**
5. Return to **Settings → Administration** → **Distributed Engine**
6. Click **Add Engine**
7. Under **Download engine**:
   - Processor architecture: **64-bit**
   - Preconfigured site: **Any site** (or your preferred site)
8. Click **Download now**
9. On the Windows Server:
   - Extract the ZIP file
   - Right-click `setup.exe` → **Run as Administrator**
   - Follow installation wizard
10. Assign to site:
    - Return to **Settings → Administration** → **Distributed Engine**
    - Select the newly installed engine
    - Select **Assign and Activate Selected Engines** from the dropdown menu
    - Select your site from the dropdown menu
    - Click **Activate**
11. Enable automatic updates:
    - Click **Configuration**
    - Click **Edit** next to **Engine settings**
    - Enable **Always Update Distributed Engines**
    - Click **Save**
12. Verify installation:
   - Return to **Settings → Administration** → **Distributed Engine**
   - Expand [Your Site] where engine was installed
   - Your engine should appear with connection status and activation status: **Online**
   

### Step 3: Install Delinea Connector

**On a domain-joined Windows Server (can be same as Platform Engine):**

1. Navigate to **Settings → Connectors**
2. Click **Add Connector**
3. Click **Download**
4. Click **Create new** and **+ Auto-generate code**
5. Copy the registration code
6. Click **Close**
7. On the Windows Server:
   - Run the downloaded installer as Administrator
   - Follow the wizard:
     - Accept license agreement
     - Keep default installation path
     - Click **Install**
   - When Configuration Wizard launches:
     - Click **Next** three times
     - Enter your tenant hostname
     - Select **Use Registration Code**
     - Paste the registration code
     - Click **Next**
     - Do NOT select your AD domain (leave unchecked)
     - Click **Next**
     - Wait for successful connection test
     - Click **Finish**
8. If prompted, restart the server
9. Verify:
   - Navigate to **Settings → Connectors**
   - Status should be **Active**

---

## Configuring Discovery

### Step 1: Enable Discovery

1. Navigate to **Discovery → Configuration**
2. Click **Edit**
3. Enable **Enable discovery**
4. Click **Save**

### Step 2: Create Discovery Source for Active Directory (Vault)

1. Navigate to **Discovery → Sources**
2. Click **Create Source**
3. In **Discovery type**, select **Vault**
4. Click **Microsoft Active Directory**
5. Click **Continue**
6. Configure:
   - **Discovery Source Name:** `Active Directory (domain.com)`
   - **Fully Qualified Domain Name:** Your domain FQDN
   - **Friendly Name:** Your domain name
   - **State:** Enabled
   - **Discovery Secret:** Click **Create new secret**
     - Template: **Active Directory Account**
     - Folder: `/Secrets/Active Directory/Service Accounts`
     - Secret name: `domain\svc_del_discovery`
     - Domain: Your domain
     - Username: `svc_del_discovery`
     - Password: Service account password
     - Click **Create Secret**
   - **Discovery Site:** Select your site
   - **Machine resolution type:** Use Machine and Fully Qualified Name
7. Click **Save**
8. Review configuration in **Add discovery scanners**
9. Click **Save**

### Step 3: Add Scanners

1. Click **Scanners**
2. Click **Add scanner** for each:
   - Windows Local Accounts
   - Application Pool
   - Scheduled Task
   - Windows Service
3. Review each scanner (no changes needed)

### Step 4: Run Discovery

1. Navigate to **Discovery → Network View**
2. Click **Sources**
3. Click **Run discovery now** → **Run discovery scan**
4. Click **Run discovery now** → **Run computer scan**
5. Wait 10-15 minutes for initial discovery
6. Return to **Discovery → Network View**
7. Refresh the page to view discovered items

### Step 5: Create Discovery Source for Identity Protection

1. Navigate to **Discovery → Sources**
2. Click **Create Source**
3. In **Discovery type**, select **Threat Protection**
4. Click **Active Directory**
5. Click **Continue**
6. Click **Add New**
   - **Domain:** Your domain FQDN
   - **Friendly Name:** Your domain name
   - **Site:** Your site
   - **Credentials:** Create new secret (use ITP service account)
7. **Integration Name:** `Active Directory (domain.com)`
8. Click **Save**
9. Wait for workflows to sync (24-48 hours for complete data)

---

## Enabling Security Features

### 1. Enable Remote Password Changing (RPC)

1. Navigate to **Settings → Administration**
2. Click **Remote Password Changing**
3. Click **Edit**
4. Enable:
   - ☑ Enable Remote Password Changing
   - ☑ Enable password changing on check in
   - ☑ Enable Heartbeat
5. Click **Save**

### 2. Enable Session Recording

1. Navigate to **Settings → Administration**
2. Click **Session Recording General Settings**
3. Click **Edit**
4. Check **Enable session recording**
5. Keep default options selected
6. Click **Save**

### 3. Import Password Changer Account

1. Navigate to **Discovery → Network View**
2. Search for your password changer account (e.g., `svc_del_changer`)
3. Select the account and click **Import**
4. Configure:
   - Site: Your site
   - Secret template: **Active Directory Account**
   - Folder: `/Secrets/Active Directory/Service Accounts`
   - Secret Name: Keep default
5. Click **Next**
6. Select **I know the current password and do not want to change it**
7. Click **Next**
8. Enter current password
9. Click **Next**
10. Click **Import**

### 4. Configure Secrets for RPC

For any imported Active Directory account secret:

1. Open the secret
2. Click **Remote Password Changing**
3. Click **Edit**
4. Configure:
   - **Change password using:** Privileged account credentials
   - **Change password using:** Select your password changer secret
   - Enable **Auto Change Enabled**
5. Click **Save**

---

## Setting Up Privileged Remote Access

### 1. Create Test Secret

1. Navigate to **Secret Server**
2. Navigate to `/Secrets/Active Directory/Admin Accounts`
3. Click **Create Secret**
4. Select template: **Active Directory Account**
5. Configure:
   - Folder: `/Secrets/Active Directory/Admin Accounts`
   - Secret name: `domain\your-admin-account`
   - Domain: Your domain
   - Username: Your admin username
   - Password: Account password
6. Click **Create Secret**

### 2. Configure RDP Launcher Settings

1. Open the secret you just created
2. Click **Settings** tab
3. Find **RDP launcher** and click **Edit**
4. Enable **Allow access to clipboard**
5. Click **Save**

### 3. Test PRA Connection

1. Return to **Overview** tab
2. Click **Open with Remote Access** under **Launchers**
3. Enter target computer name (e.g., `server01`)
4. Click **Continue**
5. Verify successful connection
6. Test clipboard functionality
7. Close session when done

### 4. Review Session Recording

1. Navigate to **Insights → Session Review**
2. Find your recent session
3. Click to view recording
4. Verify video playback works

---

## Next Steps

### Import Additional Accounts

Use **Discovery → Network View** to import discovered accounts:

1. **Domain Admin Accounts** → `/Secrets/Active Directory/Admin Accounts`
2. **Service Accounts** → `/Secrets/Active Directory/Service Accounts`
3. **Local Administrator Accounts** → `/Secrets/Local Accounts`

For each import:
- Select discovered account(s)
- Click **Import**
- Choose appropriate folder
- Select password takeover method:
  - **Generate random password** (recommended for privileged accounts)
  - **I know the current password** (for service accounts you don't want to disrupt)

### Configure Additional Security Features

**Require Comments:**
1. Open a secret
2. Click **Security**
3. Enable **Require comment**

**Hide Launcher Password:**
1. Click **Security**
2. Enable **Hide launcher password**

**Enable Check Out:**
1. Click **Security**
2. Enable **Check out**
3. Configure check-out interval

**Require MFA:**
1. Click **Security**
2. Enable **Multifactor authentication**

### Set Up Workflows (Optional)

1. Navigate to **Settings → Administration**
2. Search for **Workflows**
3. Create approval workflows for sensitive accounts

### Configure Additional Users

1. Navigate to **Access → Users**
2. Click **More → Invite Users**
3. Select **Active Directory** source
4. Search and select users
5. Assign appropriate groups
6. Click **Invite Users**

### Review Identity Posture Findings

1. Navigate to **Identity Posture → Checks**
2. Review checks
3. Click on each check to see affected accounts
4. Remediate findings as appropriate

### Documentation and Training

- Bookmark documentation: https://docs.delinea.com/online-help/delinea-platform/start.htm
- Train users on PRA access
- Document your folder structure and naming conventions
- Create runbooks for common administrative tasks

### Monitoring and Maintenance

**Daily:**
- Review session recordings for suspicious activity
- Check failed access attempts

**Weekly:**
- Run discovery scans manually if needed
- Review new discovered accounts
- Check connector and engine status

**Monthly:**
- Review Identity Protection posture checks
- Audit password rotation compliance
- Update service accounts if needed

---

## Support Resources

- **Documentation:** https://docs.delinea.com
- **Support Portal:** https://support.delinea.com
- **Community:** https://community.delinea.com

---

**Delinea** | Privileged Access Management Made Simple

*Document Version: 1.0*  
*Last Updated: February 2026*