# Delinea Discovery & RPC Permissions Reference

This document provides a comprehensive reference of permissions required for **Delinea Platform**, including for discovery, management, and CIEM/ITDR.

---

## Active Directory

### Discovery

**Account Requirements:**

**Domain-Level Permissions:**
- Default AD configuration typically allows scanning computers and users
- Account must be able to query Active Directory via LDAP

**Machine-Level Permissions:**
- **Access this computer from the network** permission
- Membership in local **Administrators** group on target machines
- **Network access: Restrict clients allowed to make remote calls to SAM** (for Windows Server 2016+, Windows 10 1607+)
  - Discovery account must have **Remote Access** permission allowed

**Service Account Discovery (Additional Requirements):**
- Must be a **domain account**
- Must be in the **Administrators** group on target machines

---

### Remote Password Changing (RPC)

**Required Permissions:**
- Change Password
- Read lockoutTime
- Read pwdLastSet
- Reset Password
- Write lockoutTime
- Write pwdLastSet
- Write UserAccountControl
- Read UserAccountControl

---

## Amazon Web Services (AWS)

### Discovery
- `iam:ListUsers`
- `iam:GetLoginProfile`
- `iam:ListAccessKeys`
- `EC2:DescribeInstances`
- `EC2:DescribeAvailabilityZones`

### RPC - IAM Access Keys (Self-Rotation)
For accounts rotating their own keys:
- `iam:DeleteAccessKey`
- `iam:UpdateAccessKey`
- `iam:CreateAccessKey`
- `iam:ListAccessKeys`

### RPC - IAM Access Keys (Privileged)
For privileged accounts rotating other users' keys:
- `iam:DeleteAccessKey`
- `iam:UpdateAccessKey`
- `iam:CreateAccessKey`
- `iam:ListAccessKeys`

### RPC - IAM Console Password
- `iam:UpdateLoginProfile`
- `iam:ChangePassword`


### CIEM Discovery
**CloudTrail Configuration (Required):**
- CloudTrail must collect data from all regions
- CloudTrail must collect global service events (IAM and STS API calls)
- CloudTrail logs must be delivered to an S3 bucket

**S3 Bucket Permissions:**
- `s3:GetObject` on CloudTrail logs bucket
- Applied to the integration role (default: `AuthomizeCrossAccountTrustRole`)

**IAM Permissions:**
- AWS ReadOnlyAccess managed policy (automatically assigned via CloudFormation)

### AWS Identity Center (Additional Permissions)
When integrating AWS Identity Center:
- `AWSSSOReadOnly`
- `AWSSSODirectoryReadOnly`

---

## Google Cloud Platform (GCP)

### Discovery
- **Project Viewer** role
  - Lists projects, zones, service accounts, and instances

### RPC/Heartbeat
- **Service Account Key Admin** role
  - Creates, deletes, and rotates service account keys

### ITDR Integration
**Configuration:** Domain-wide Delegation in Google Workspace Admin Console

**OAuth 2.0 Scopes Required:**

These are permission scope identifiers (not URLs to visit) that must be configured in Google Workspace Admin Console under Security > Access and Data Control > API Controls > Domain-wide Delegation:

- `https://www.googleapis.com/auth/cloudplatformorganizations.readonly`
- `https://www.googleapis.com/auth/admin.directory.customer.readonly`
- `https://www.googleapis.com/auth/admin.directory.domain.readonly`
- `https://www.googleapis.com/auth/admin.directory.group.member.readonly`
- `https://www.googleapis.com/auth/admin.directory.group.readonly`
- `https://www.googleapis.com/auth/admin.directory.notifications`
- `https://www.googleapis.com/auth/admin.directory.orgunit.readonly`
- `https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly`
- `https://www.googleapis.com/auth/admin.directory.user.readonly`
- `https://www.googleapis.com/auth/admin.directory.userschema.readonly`
- `https://www.googleapis.com/auth/admin.reports.audit.readonly`
- `https://www.googleapis.com/auth/cloud-platform.read-only`

---

## MSFT Entra ID

### Discovery
**Application Permissions Required** (must be Application Permissions, NOT Delegated Permissions):
- `EntitlementManagement.Read.All`
- `RoleManagement.Read.Directory`
- `User.Read.All`

### RPC
**Service Principal Role Assignments:**
- **User Administrator** role (for non-administrator accounts)
- **Privileged Authentication Administrator** role (for administrator accounts)

### ITDR/CIEM Integration

#### Read-Only Mode
**Microsoft Graph API Permissions** (Application Permissions with admin consent required)

**Coverage:**
- Users
- Groups
- Roles and admins
- Applications, Application Access, and Azure Managed Identities
- App Registrations
- Sign-in and Audit Log activities
- SharePoint Sites
- Office 365 Audit Log activities

#### Read/Write Mode
**Includes all Read-Only permissions PLUS:**
- Additional write-enabling OAuth scopes

**Capabilities:**
- Disable/enable users
- Revoke user sessions
- Add/remove users from groups

#### Azure Cloud Integration (Optional)
**Covers:**
- Azure subscriptions
- Resource groups
- Resources
- Roles and privileges
- Management log activities
- LLMs and AI Agents

**Required Role:**
- **Reader** role on subscriptions for CIEM functionality

---

## Unix

### Discovery
**Account Requirements:**
- SSH access to target systems
- Read access to `/etc/passwd`
- `sudo passwd <username>` capability (required for account takeover)

### RPC
- `passwd` command is used
- Default local settings apply during password changes

---

## ESXi

### Discovery
- **Shell Access** permission
- **Query VRM Policy** permission

---

## Windows (Local Accounts)

### Discovery
**Required Permissions:**
- **Access this computer from the network** permission
- Membership in local **Administrators** group

**Additional Requirement (Windows Server 2016+, Windows 10 1607+):**
- **Network access: Restrict clients allowed to make remote calls to SAM** policy
  - Discovery account must have **Remote Access** permission allowed

**Applicable to:**
- Windows Server 2016, 2019
- Windows 10 version 1607 and later
- Earlier versions with specific KB updates installed

---

## Windows (Services, Scheduled Tasks, App Pools, COM+)

### Discovery
**Account Requirements:**
- Domain account
- Membership in **Administrators** group on target machines
- **Access this computer from the network** permission

**Best Practice (Optional but Recommended):**
Limit discovery account login privileges:
- Add to **Deny log on locally** policy
- Add to **Deny log on through Remote Desktop Services** policy

---

## Notes

### Permission Types
- **Application Permissions:** Granted at the application/tenant level, do not require user interaction
- **Delegated Permissions:** Require a signed-in user, permissions are constrained by user's privileges
- **OAuth Scopes:** Define the level of access granted to an application for specific APIs

### CloudFormation Integration
AWS integrations using CloudFormation automatically provision the required IAM roles and policies. Manual integrations require creating these roles and policies manually.

### Domain-wide Delegation
Google Cloud Platform ITDR integration requires Domain-wide Delegation to be configured in Google Workspace Admin Console to grant the service account access to Google Workspace APIs on behalf of users.

---
