# Delinea Guides

Simple, minimal, and easy-to-follow guides for getting started with Delinea solutions.

*Please refer to product documentation for the most up-to-date guidance and information. This content is provided with no guarantees or support.*

## About

Getting the Delinea Platform set up and running shouldn't require sifting through dense documentation. These guides cut through the noise and give administrators a clear, step-by-step path from zero to functional deployment.

Each guide is designed to be followed start to finish in a single session, with prerequisites and detailed steps.

## Guides

| Guide | Description |
|-------|-------------|
| [Platform Quick Start](platform-quick-start-guide.md) | Deploy the Delinea Platform with Active Directory integration, discovery, identity protection, and privileged remote access |
| [Discovery & RPC Permissions Reference](platform-required-permissions.md) | Comprehensive reference of permissions required for Discovery and Remote Password Changing (RPC) across target sources |
| [UC-1: Centralized Vault for AWS Accounts](use-case/uc1-aws-iam-workflow.md) | Securely store AWS accounts with dual approval for access and complete audit trails for break-glass scenarios |
| [UC-2: Discovery and Onboarding of IAM User Access Keys](use-case/uc2-aws-iam-discovery.md) | Automatically find AWS IAM Users and their associated Access Keys, then import these secrets into the vault for centralized management |
| [UC-3: Management of GCP Service Account Keys](use-case/uc3-gcp-service-keys.md) | Onboard JSON key files for GCP Service Accounts and manage over-privileged service account keys through PAM |
| [UC-4: Secure Storage of Snowflake User Passwords](use-case/uc4-snowflake-credentials.md) | Vault passwords for Snowflake users with ACCOUNTADMIN or SYSADMIN roles and securely store private keys used for key pair authentication |
| [UC-5: Brokered Web Session to Cloud Consoles](use-case/uc5-brokered-web-sessions.md) | Launch browser sessions via Privileged Remote Access (PRA) to AWS Management Console without exposing passwords, with full session recording |
| [UC-6: Time-Limited Access for Snowflake Privileged Roles](use-case/uc6-snowflake-jit-workaround.md) | Provide time-bound access to Snowflake SYSADMIN credentials with approval workflows and automatic access expiration |
| [UC-7: Secure SSH Session to Cloud Bastion Hosts](use-case/uc7-ssh-bastion-sessions.md) | Broker SSH sessions to critical bastion/jump hosts with SSH key checkout and keystroke logging |
| [UC-8: CI/CD Pipeline Integration for Cloud Deployments](use-case/uc8-cicd-pipeline.md) | Configure CI/CD pipelines to retrieve AWS credentials dynamically from the Platform via REST API |
| [UC-9: Comprehensive Audit Trail for Compliance Reporting](use-case/uc9-audit-compliance.md) | Generate compliance reports showing who accessed which cloud account, when, from where, with session playback capability |

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
