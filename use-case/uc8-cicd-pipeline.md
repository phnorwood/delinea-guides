# Use-Case: CI/CD Pipeline Integration for Cloud Deployments

**Objective:** Configure Jenkins or GitLab CI/CD pipeline to retrieve AWS credentials dynamically from the Delinea Platform instead of hardcoding keys. The pipeline authenticates to the Platform using a service account, retrieves AWS keys via REST API, uses them for deployment, and validates that API calls are logged.

**Prerequisites:**
- Delinea Platform tenant configured with admin access
- AWS credentials stored in Platform
- Jenkins or GitLab CI/CD environment configured
- Basic understanding of CI/CD pipeline configuration
- API access enabled on Platform

**Estimated Time:** 60-90 minutes

---

## Step 1: Verify AWS Credentials in Platform

### 1.1: Confirm AWS Secrets Exist

1. Log in to Delinea Platform
2. Navigate to **Secret Server → All Secrets**
3. Browse to folder: `/AWS/Admin Accounts`
4. Verify you have AWS credentials stored, such as:
   - AWS IAM User access keys
   - Format: `AWS Access Key - [Username] - [Account-ID]`
5. Note the **Secret ID** from the URL when viewing a secret
   - Example URL: `https://[tenant].delinea.app/secrets/12345`
   - Secret ID: `12345`

---

## Step 2: Create Service Account for CI/CD Access

### 2.1: Create Application User

1. Navigate to **Access → Users**
2. Click **Add Local User**
3. Configure:
   - **Username:** `cicd-jenkins-service` (or `cicd-gitlab-service`)
   - **Display Name:** `CI/CD Service Account - Jenkins`
   - **Email:** DevOps team email
4. Click **Next**
5. Select **Membership Type:** Application
6. Click **Next**
7. Assign to group: Create or select `CI/CD Service Accounts` group
8. Click **Add**
9. Save the username for later use

### 2.2: Set Password for Service Account

1. Find the newly created user in the user list
2. Click on the user
3. Click **Reset Password**
4. Set a strong password
5. **Important:** Save this password securely (you'll need it for API authentication)

---

## Step 3: Configure API Access Permissions

### 3.1: Create Role for API Access

1. Navigate to **Access → Roles**
2. Click **Create Role**
3. Configure:
   - **Role Name:** `API Secret Reader`
   - **Description:** `Read-only access to secrets via API`
4. Click **Create**
5. Click **Edit Permissions**
6. Add permissions:
   - **Secrets:** View
   - **API Access:** Allow
7. Click **Save**

### 3.2: Grant Service Account Access to AWS Secrets

1. Navigate to **Secret Server → All Secrets**
2. Browse to `/AWS/Admin Accounts`
3. Click on the AWS secret you want the pipeline to access
4. Click **Security** tab
5. Click **Edit Permissions**
6. Click **Add**
7. Configure:
   - **User/Group:** Select `cicd-jenkins-service`
   - **Role:** Select **View** or `API Secret Reader`
8. Click **Save**
9. Repeat for any other AWS secrets needed by CI/CD

---

## Step 4: Generate API Token for Service Account

### 4.1: Create API Access Token

1. Log out of admin account
2. Log in as the service account: `cicd-jenkins-service`
3. Click on user profile (top right)
4. Navigate to **API Keys** or **Access Tokens**
5. Click **Generate New Token**
6. Configure:
   - **Token Name:** `Jenkins Production Pipeline`
   - **Expiration:** `1 year` (or per security policy)
   - **Scopes:** Read Secrets
7. Click **Generate**
8. **CRITICAL:** Copy the API token immediately
   - Token format: `Bearer eyJ0eXAiOiJKV1QiLCJhbGc...`
   - This is shown ONLY ONCE
9. Save token securely in password manager

**Alternative - Using OAuth2:**
If OAuth2 is preferred:
1. Navigate to **Settings → API**
2. Create OAuth2 client credentials
3. Note Client ID and Client Secret
4. Use these for token exchange in pipeline

---

## Step 5: Test API Access

### 5.1: Test API Call Using curl

On your workstation or CI/CD server:

```bash
# Set variables
PLATFORM_URL="https://[your-tenant].delinea.app"
API_TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."
SECRET_ID="12345"

# Test API authentication
curl -X GET \
  "${PLATFORM_URL}/api/v1/secrets/${SECRET_ID}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "id": 12345,
  "name": "AWS Access Key - deployment-user - 123456789012",
  "secretTemplateId": 6003,
  "folderId": 5,
  "active": true,
  "items": [
    {
      "slug": "access-key-id",
      "itemValue": "AKIA..."
    },
    {
      "slug": "secret-access-key",
      "itemValue": "wJalrXUtn..."
    }
  ]
}
```

### 5.2: Extract Specific Field

```bash
# Extract Access Key ID
ACCESS_KEY=$(curl -s -X GET \
  "${PLATFORM_URL}/api/v1/secrets/${SECRET_ID}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  | jq -r '.items[] | select(.slug=="access-key-id") | .itemValue')

echo "Access Key: ${ACCESS_KEY}"

# Extract Secret Access Key
SECRET_KEY=$(curl -s -X GET \
  "${PLATFORM_URL}/api/v1/secrets/${SECRET_ID}" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  | jq -r '.items[] | select(.slug=="secret-access-key") | .itemValue')

echo "Secret Key: ${SECRET_KEY:0:10}..." # Only show first 10 chars
```

---

## Step 6: Configure Jenkins Integration

### 6.1: Install Delinea Plugin (If Available)

1. In Jenkins, navigate to **Manage Jenkins → Plugins**
2. Click **Available Plugins**
3. Search for: `Delinea Secret Server`
4. Select the plugin and click **Install**
5. Restart Jenkins when prompted

### 6.2: Configure Plugin Connection (If Using Plugin)

1. Navigate to **Manage Jenkins → Configure System**
2. Find **Delinea Secret Server** section
3. Click **Add Credentials**
4. Configure:
   - **Kind:** Secret text
   - **Secret:** Paste API token
   - **ID:** `delinea-api-token`
   - **Description:** `Delinea Platform API Token`
5. Click **Add**
6. Configure connection:
   - **Platform URL:** `https://[your-tenant].delinea.app`
   - **Credentials:** Select `delinea-api-token`
7. Click **Test Connection**
8. Verify: "Connection successful"
9. Click **Save**

### 6.3: Store API Token in Jenkins Credentials (Alternative)

If not using plugin:

1. Navigate to **Manage Jenkins → Credentials**
2. Select appropriate domain (usually "Global")
3. Click **Add Credentials**
4. Configure:
   - **Kind:** Secret text
   - **Scope:** Global
   - **Secret:** Paste API token
   - **ID:** `delinea-api-token`
   - **Description:** `Delinea Platform API Token`
5. Click **Create**

### 6.4: Store Platform URL in Jenkins

1. Navigate to **Manage Jenkins → Configure System**
2. Under **Global Properties**, check **Environment variables**
3. Add variable:
   - **Name:** `DELINEA_PLATFORM_URL`
   - **Value:** `https://[your-tenant].delinea.app`
4. Click **Save**

---

## Step 7: Create Jenkins Pipeline with Platform Integration

### 7.1: Create Simple Test Pipeline

1. In Jenkins, click **New Item**
2. Enter name: `test-delinea-aws-deployment`
3. Select **Pipeline**
4. Click **OK**
5. In pipeline configuration, select **Pipeline script**
6. Paste the following script:

```groovy
pipeline {
    agent any
    
    environment {
        PLATFORM_URL = "${env.DELINEA_PLATFORM_URL}"
        SECRET_ID = "12345" // Replace with your AWS secret ID
    }
    
    stages {
        stage('Retrieve AWS Credentials') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'delinea-api-token', variable: 'API_TOKEN')]) {
                        // Retrieve secret from Platform
                        def response = sh(
                            script: """
                                curl -s -X GET \
                                "${PLATFORM_URL}/api/v1/secrets/${SECRET_ID}" \
                                -H "Authorization: Bearer ${API_TOKEN}" \
                                -H "Content-Type: application/json"
                            """,
                            returnStdout: true
                        ).trim()
                        
                        // Parse JSON response
                        def secret = readJSON text: response
                        
                        // Extract credentials
                        env.AWS_ACCESS_KEY_ID = secret.items.find { it.slug == 'access-key-id' }.itemValue
                        env.AWS_SECRET_ACCESS_KEY = secret.items.find { it.slug == 'secret-access-key' }.itemValue
                        
                        echo "AWS credentials retrieved from Platform"
                    }
                }
            }
        }
        
        stage('Test AWS CLI') {
            steps {
                script {
                    sh '''
                        # Configure AWS CLI with retrieved credentials
                        aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                        aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                        aws configure set region us-east-1
                        
                        # Test AWS access - list S3 buckets
                        echo "Testing AWS access..."
                        aws s3 ls
                        
                        echo "AWS credentials validated successfully"
                    '''
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    sh '''
                        # Example deployment command
                        echo "Deploying application with Platform-managed credentials..."
                        
                        # Your actual deployment commands here
                        # Examples:
                        # aws s3 sync ./build s3://my-app-bucket
                        # aws ecs update-service --service my-service --force-new-deployment
                        # terraform apply -auto-approve
                        
                        echo "Deployment completed"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clear credentials from environment
                sh 'unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY'
                echo "Credentials cleared from environment"
            }
        }
    }
}
```

7. Click **Save**

### 7.2: Run Test Pipeline

1. Click **Build Now**
2. Monitor console output
3. Verify stages complete:
   - ✅ Retrieve AWS Credentials
   - ✅ Test AWS CLI (should list S3 buckets)
   - ✅ Deploy Application
4. Check for any errors

---

## Step 8: Configure GitLab CI/CD Integration (Alternative)

### 8.1: Store API Token in GitLab

1. In GitLab, navigate to your project
2. Go to **Settings → CI/CD**
3. Expand **Variables**
4. Click **Add Variable**
5. Configure:
   - **Key:** `DELINEA_API_TOKEN`
   - **Value:** Paste API token
   - **Type:** Variable
   - **Protected:** ✓
   - **Masked:** ✓
6. Click **Add Variable**
7. Add another variable:
   - **Key:** `DELINEA_PLATFORM_URL`
   - **Value:** `https://[your-tenant].delinea.app`
8. Click **Add Variable**

### 8.2: Create GitLab CI Pipeline

Create `.gitlab-ci.yml` in your repository:

```yaml
variables:
  AWS_SECRET_ID: "12345"  # Replace with your secret ID

stages:
  - retrieve
  - deploy

retrieve_credentials:
  stage: retrieve
  image: curlimages/curl:latest
  script:
    - echo "Retrieving AWS credentials from Delinea Platform..."
    - |
      RESPONSE=$(curl -s -X GET \
        "${DELINEA_PLATFORM_URL}/api/v1/secrets/${AWS_SECRET_ID}" \
        -H "Authorization: Bearer ${DELINEA_API_TOKEN}" \
        -H "Content-Type: application/json")
    
    - echo "$RESPONSE" > secret.json
    
    # Extract credentials using jq
    - export AWS_ACCESS_KEY_ID=$(cat secret.json | jq -r '.items[] | select(.slug=="access-key-id") | .itemValue')
    - export AWS_SECRET_ACCESS_KEY=$(cat secret.json | jq -r '.items[] | select(.slug=="secret-access-key") | .itemValue')
    
    # Save to artifacts for next stage
    - echo "export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" > aws_creds.sh
    - echo "export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >> aws_creds.sh
  
  artifacts:
    paths:
      - aws_creds.sh
    expire_in: 10 mins

deploy_to_aws:
  stage: deploy
  image: amazon/aws-cli:latest
  dependencies:
    - retrieve_credentials
  script:
    - echo "Deploying to AWS..."
    - source aws_creds.sh
    
    # Test AWS access
    - aws s3 ls
    
    # Your deployment commands
    - echo "Running deployment..."
    # aws s3 sync ./build s3://my-bucket
    # terraform apply -auto-approve
    
  after_script:
    # Clean up credentials
    - rm -f aws_creds.sh secret.json
    - unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
```

---

## Step 9: Verify API Logging in Platform

### 9.1: Review API Access Logs

1. As administrator, navigate to **Insights → Reports**
2. Select report: **API Access Audit**
3. Filter by:
   - **User:** `cicd-jenkins-service`
   - **Date Range:** Today
4. Review logged events:
   - API authentication (token used)
   - Secret retrieval (Secret ID accessed)
   - Timestamp of each access
   - Source IP address (Jenkins/GitLab server)
5. Verify each pipeline run created log entries

### 9.2: Create API Usage Report

1. Click **Export** to save audit data
2. Select format: **CSV**
3. Verify report includes:
   - Timestamp
   - Service account username
   - Secret accessed
   - API endpoint called
   - Response status (200 = success)

---

## Step 10: Configure Credential Rotation

### 10.1: Enable Automatic Rotation for AWS Keys

1. Navigate to your AWS access key secret in Platform
2. Click **Remote Password Changing** tab
3. Click **Edit**
4. Configure:
   - **☑ Enable Auto Change**
   - **Auto Change Schedule:** `90 Days`
   - **Change password using:** Privileged Account (select AWS admin account)
5. Click **Save**

### 10.2: Test Rotation Impact on Pipeline

1. Manually trigger credential rotation:
   - In secret, click **Change Password Now**
   - Wait for rotation to complete
2. Run Jenkins/GitLab pipeline again
3. Verify:
   - Pipeline retrieves NEW credentials
   - Pipeline completes successfully
   - No hardcoded credentials need updating

This demonstrates the benefit of dynamic retrieval.

---

## Step 11: Configure Alerts for CI/CD API Access

### 11.1: Create Alert for API Secret Access

1. Navigate to **Settings → Administration**
2. Search for **Event Subscriptions**
3. Click **Create Subscription**
4. Configure:
   - **Subscription Name:** `CI/CD API Access Alert`
   - **Event Type:** Secret Accessed via API
   - **Filter by user:** `cicd-jenkins-service`
   - **Filter by folder:** `/AWS/Admin Accounts`
   - **Alert method:** Email
   - **Recipients:** DevOps and Security team
5. Click **Save**

### 11.2: Create Alert for Failed API Calls

1. Click **Create Subscription** again
2. Configure:
   - **Subscription Name:** `Failed CI/CD API Access`
   - **Event Type:** API Authentication Failed
   - **Filter by user:** `cicd-jenkins-service`
   - **Alert method:** Email
   - **Recipients:** DevOps and Security team
3. Click **Save**

---

## Success Criteria Verification

- ✅ CI/CD service account created in Platform
- ✅ API token generated for service account
- ✅ Service account granted access to AWS secrets
- ✅ Jenkins or GitLab configured with Platform connection
- ✅ Pipeline retrieves AWS credentials via REST API at runtime
- ✅ Credentials used for AWS CLI commands (aws s3 ls)
- ✅ No credentials hardcoded in pipeline configuration
- ✅ Pipeline completes successfully with dynamic credentials
- ✅ API calls logged in Platform audit trail showing:
  - Service account authentication
  - Secret retrieval timestamp
  - Secret ID accessed
- ✅ Credentials cleared from environment after use
- ✅ Credential rotation tested - pipeline works with new credentials
- ✅ Alerts configured for API access monitoring
- ✅ Security team receives notifications of CI/CD API usage

---