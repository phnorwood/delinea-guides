import React, { useState } from 'react';
import { FileDown, FileText, CheckCircle } from 'lucide-react';

const DelineaGuideDownload = () => {
  const [downloading, setDownloading] = useState({ pdf: false, md: false });
  const [completed, setCompleted] = useState({ pdf: false, md: false });

  const guideContent = `# Delinea Platform Deployment Guide

**Quick Start Guide for IT Administrators**

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

\`\`\`
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
\`\`\`

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
3. Set up your \`cloudadmin\` account password
4. Enable multi-factor authentication (recommended)

### 3. Create Platform Administrator Account

1. Log in to your tenant: \`https://[your-tenant].delinea.app\`
2. Navigate to **Access → Users**
3. Click **Add Local User**
   - Username: \`[firstname.lastname]@[tenant-hostname]\`
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

\`\`\`
Root
├── Secrets
│   ├── Active Directory
│   │   ├── Admin Accounts
│   │   ├── Service Accounts
│   │   └── Discovery Accounts
│   └── Local Accounts
└── Shared Secrets
\`\`\`

---

## Installing Core Components

### Step 1: Create a Site

1. Navigate to **Settings → Engine Management**
2. Click **Create Site**
   - Site Name: \`Primary-DataCenter\` (or your preferred name)
   - Description: \`Primary on-premises location\`
3. Click **Save**

### Step 2: Install Platform Engine with Workloads

**On your designated Windows Server:**

1. In the Delinea Platform, navigate to **Settings → Engine Management**
2. Click on your site name
3. Click **Engines → Add Engine**
4. Select:
   - Operating system: **Windows**
   - Capabilities:
     - ☑ Privileged Remote Access (PRA)
     - ☑ ITP For Active Directory
     - ☑ PCCE For Active Directory
5. Click **Generate Script**
6. Click **Copy PowerShell Script**
7. On the Windows Server:
   - Right-click PowerShell icon → **Run as Administrator**
   - Paste the script
   - Press Enter
8. Wait for installation to complete (5-10 minutes)
9. Verify installation:
   - Return to **Settings → Engine Management → [Your Site] → Engines**
   - Your server should appear with status: **Active**

### Step 3: Install Distributed Engine

**On the same or different Windows Server:**

1. Navigate to **Settings → Administration**
2. Search for **Distributed Engine**
3. Click **Add Engine**
4. Under **Download engine**:
   - Processor architecture: **64-bit**
   - Preconfigured site: **Any site**
5. Click **Download now**
6. On the Windows Server:
   - Extract the ZIP file
   - Right-click \`setup.exe\` → **Run as Administrator**
   - Follow installation wizard
7. Assign to site:
   - Return to **Settings → Distributed Engine**
   - Select the newly installed engine
   - Click **Assign and Activate Selected Engines**
   - Select your site
   - Click **Activate**
8. Enable automatic updates:
   - Click **Configuration**
   - Click **Edit** next to **Engine settings**
   - Enable **Always Update Distributed Engines**
   - Click **Save**

### Step 4: Install Delinea Connector

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
   - **Discovery Source Name:** \`Active Directory (domain.com)\`
   - **Fully Qualified Domain Name:** Your domain FQDN
   - **Friendly Name:** Your domain name
   - **State:** Enabled
   - **Discovery Secret:** Click **Create new secret**
     - Template: **Active Directory Account**
     - Folder: \`/Secrets/Active Directory/Service Accounts\`
     - Secret name: \`domain\\svc_del_discovery\`
     - Domain: Your domain
     - Username: \`svc_del_discovery\`
     - Password: Service account password
     - Click **Create Secret**
   - **Discovery Site:** Select your site
   - **Machine resolution type:** Use Machine and Fully Qualified Name
7. Click **Save**
8. In **Add discovery scanners**, click **Save**

### Step 3: Add Scanners

1. Click **Scanners**
2. Click **Add scanner** for each:
   - Windows Local Accounts
   - Application Pool
   - Scheduled Task
   - Windows Service
3. Review each scanner (no changes needed)
4. Click **Save**

### Step 4: Run Discovery

1. Navigate to **Discovery → Network View**
2. Click **Sources**
3. Click **Run discovery now** → **Run discovery scan**
4. Click **Run discovery now** → **Run computer scan**
5. Wait 10-15 minutes for initial discovery
6. Refresh the page to view discovered items

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
7. **Integration Name:** \`Active Directory (domain.com)\`
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
2. Click **Session Recording → General Settings**
3. Click **Edit**
4. Enable **Enable session recording**
5. Keep default options selected
6. Click **Save**

### 3. Configure Platform Groups Sync

1. Navigate to **Settings → Platform Groups Sync**
2. Click **Configuration**
3. Click **Edit**
4. Set **Synchronization Interval** to **1 Hour** (for testing; adjust later)
5. Click **Save**

### 4. Import Password Changer Account

1. Navigate to **Discovery → Network View**
2. Search for your password changer account (e.g., \`svc_del_changer\`)
3. Select the account and click **Import**
4. Configure:
   - Site: Your site
   - Secret template: **Active Directory Account**
   - Folder: \`/Secrets/Active Directory/Service Accounts\`
   - Secret Name: Keep default
5. Click **Next**
6. Select **I know the current password and do not want to change it**
7. Click **Next**
8. Enter current password
9. Click **Next**
10. Click **Import**

### 5. Configure Secrets for RPC

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
2. Navigate to \`/Secrets/Active Directory/Admin Accounts\`
3. Click **Create Secret**
4. Select template: **Active Directory Account**
5. Configure:
   - Folder: \`/Secrets/Active Directory/Admin Accounts\`
   - Secret name: \`domain\\your-admin-account\`
   - Domain: Your domain
   - Username: Your admin username
   - Password: Account password
6. Click **Create Secret**

### 2. Configure RDP Launcher Settings

1. Open the secret you just created
2. Click **Settings**
3. Find **RDP launcher** and click **Edit**
4. Enable **Allow access to clipboard**
5. Click **Save**

### 3. Test PRA Connection

1. Click **Launch** (or **Open with Remote Access**)
2. Click **Open with Remote Access**
3. Enter target computer name (e.g., \`server01\`)
4. Click **Continue**
5. Verify successful connection
6. Test clipboard functionality
7. Close session when done

### 4. Review Session Recording

1. Navigate to **Activity → Session Recording**
2. Find your recent session
3. Click to view recording
4. Verify video playback works

---

## Next Steps

### Import Additional Accounts

Use **Discovery → Network View** to import discovered accounts:

1. **Domain Admin Accounts** → \`/Secrets/Active Directory/Admin Accounts\`
2. **Service Accounts** → \`/Secrets/Active Directory/Service Accounts\`
3. **Local Administrator Accounts** → \`/Secrets/Local Accounts\`

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

### Review Identity Protection Findings

1. Navigate to **Identity Protection → Posture Checks**
2. Review failed checks
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
*Last Updated: February 2026*`;

  const downloadMarkdown = () => {
    setDownloading(prev => ({ ...prev, md: true }));
    
    const blob = new Blob([guideContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Delinea_Platform_Deployment_Guide.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setDownloading(prev => ({ ...prev, md: false }));
      setCompleted(prev => ({ ...prev, md: true }));
    }, 1000);
  };

  const downloadPDF = () => {
    setDownloading(prev => ({ ...prev, pdf: true }));
    
    // Create a simple HTML representation for PDF conversion
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Delinea Platform Deployment Guide</title>
  <style>
    @page {
      size: Letter;
      margin: 0.75in;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 100%;
    }
    h1 {
      color: #1e3a5f;
      font-size: 24pt;
      margin-top: 0;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    h2 {
      color: #1e3a5f;
      font-size: 18pt;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
      border-bottom: 2px solid #00c389;
      padding-bottom: 0.25em;
    }
    h3 {
      color: #2c5282;
      font-size: 14pt;
      margin-top: 1.2em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    h4 {
      color: #2c5282;
      font-size: 12pt;
      margin-top: 1em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
    }
    p {
      margin: 0.5em 0;
    }
    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }
    li {
      margin: 0.25em 0;
    }
    code {
      background-color: #f5f5f5;
      padding: 0.1em 0.3em;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10pt;
    }
    pre {
      background-color: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      line-height: 1.4;
      page-break-inside: avoid;
    }
    blockquote {
      border-left: 4px solid #00c389;
      margin: 1em 0;
      padding-left: 1em;
      color: #555;
    }
    strong {
      color: #1e3a5f;
      font-weight: 600;
    }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2em 0;
    }
    .toc {
      background-color: #f8f9fa;
      padding: 1em;
      border-radius: 5px;
      margin: 1em 0;
    }
    .toc ul {
      list-style: none;
      padding-left: 0;
    }
    .toc li {
      margin: 0.5em 0;
    }
    .page-break {
      page-break-before: always;
    }
    .subtitle {
      color: #666;
      font-size: 14pt;
      margin-top: 0.5em;
      margin-bottom: 2em;
    }
    .checkbox {
      display: inline-block;
      width: 1em;
      height: 1em;
      border: 1px solid #666;
      margin-right: 0.5em;
      vertical-align: middle;
    }
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
${guideContent
  .replace(/^# (.*$)/gm, '<h1>$1</h1>')
  .replace(/^## (.*$)/gm, '<h2>$2</h2>')
  .replace(/^### (.*$)/gm, '<h3>$1</h3>')
  .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/^- \[ \] (.*)$/gm, '<li><span class="checkbox"></span>$1</li>')
  .replace(/^- (.*$)/gm, '<li>$1</li>')
  .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
  .replace(/^---$/gm, '<hr>')
  .replace(/\n\n/g, '</p><p>')
}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Delinea_Platform_Deployment_Guide.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setDownloading(prev => ({ ...prev, pdf: false }));
      setCompleted(prev => ({ ...prev, pdf: true }));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-teal-500 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Delinea Platform Deployment Guide
              </h1>
              <p className="text-slate-600">Quick Start Guide for IT Administrators</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-600">Version</p>
              <p className="text-lg font-semibold text-slate-800">1.0</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Pages</p>
              <p className="text-lg font-semibold text-slate-800">~35</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Last Updated</p>
              <p className="text-lg font-semibold text-slate-800">Feb 2026</p>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PDF Download */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileDown className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  HTML for PDF Conversion
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Download HTML file to convert to PDF using your preferred tool (e.g., browser print, Adobe, Pandoc)
                </p>
              </div>
            </div>
            
            <button
              onClick={downloadPDF}
              disabled={downloading.pdf}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading.pdf ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing...
                </>
              ) : completed.pdf ? (
                <>
                  <CheckCircle size={20} />
                  Downloaded
                </>
              ) : (
                <>
                  <FileDown size={20} />
                  Download HTML
                </>
              )}
            </button>
            
            <p className="text-xs text-slate-500 mt-3">
              Open in browser and use Print → Save as PDF for best results
            </p>
          </div>

          {/* Markdown Download */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-teal-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Markdown Source
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Download editable Markdown file for customization and version control
                </p>
              </div>
            </div>
            
            <button
              onClick={downloadMarkdown}
              disabled={downloading.md}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading.md ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing...
                </>
              ) : completed.md ? (
                <>
                  <CheckCircle size={20} />
                  Downloaded
                </>
              ) : (
                <>
                  <FileDown size={20} />
                  Download Markdown
                </>
              )}
            </button>
            
            <p className="text-xs text-slate-500 mt-3">
              Edit with any text editor or Markdown tool
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Usage Instructions
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>For PDF:</strong> Download the HTML file, open in your browser, and use Print → Save as PDF with appropriate page settings</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>For editing:</strong> Download the Markdown file and use tools like VS Code, Typora, or any Markdown editor</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>Professional PDF:</strong> For best results, use Pandoc or similar tools to convert Markdown to PDF with custom styling</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-600">
          <p>Created for Delinea Platform Deployment</p>
          <p className="mt-1">© 2026 Delinea. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DelineaGuideDownload;