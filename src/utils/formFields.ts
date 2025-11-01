import { SectionDefinition } from '../types';

export const questionnaireSections: SectionDefinition[] = [
  {
    id: 'A',
    title: 'General & Business Information',
    fields: [
      { name: 'companyName', label: 'Company/Department Name', type: 'text', hint: 'Business entity using GCP - Found under Billing => Account', required: true },
      { name: 'gcpOrgId', label: 'GCP Organization ID', type: 'text', hint: 'Settings', required: true },
      { name: 'billingAccountId', label: 'Billing Account Name/ID', type: 'text', hint: 'Required for cost mapping', required: true },
      { name: 'primaryContact', label: 'Primary Cloud Contact Person', type: 'text', hint: 'Name & designation', required: true },
      { name: 'activeProjects', label: 'Number of Active Projects', type: 'numeric', hint: 'Count in billing account' },
      { name: 'projectsList', label: 'List of projects with owners', type: 'upload', hint: 'CSV or GCP export' },
      { name: 'workloadTypes', label: 'Types of workloads', type: 'multi-select', hint: 'Production, Dev, UAT, Sandbox', options: ['Production', 'Development', 'UAT', 'Sandbox', 'Other'] },
      { name: 'businessFunctions', label: 'Primary business functions hosted', type: 'dropdown', hint: 'Logistics, Analytics, Apps, AI/ML', options: ['Logistics', 'Analytics', 'Applications', 'AI/ML', 'Data Processing', 'Web Services', 'Other'] },
      { name: 'gcpUsers', label: 'Average number of GCP users/admins', type: 'dropdown', hint: '1-10,11-25,26-50,51-100,>100', options: ['1-10', '11-25', '26-50', '51-100', '>100'] },
      { name: 'orgChart', label: 'Current GCP Org chart', type: 'upload', hint: 'Optional governance structure' }
    ]
  },
  {
    id: 'B',
    title: 'Current GCP Spend & Billing Overview',
    fields: [
      { name: 'monthlySpend', label: 'Current average monthly spend (USD/SAR)', type: 'numeric', hint: 'Estimate or invoice value', required: true },
      { name: 'billingReports', label: 'Last 3 months billing reports', type: 'upload', hint: 'CSV or PDF' },
      { name: 'spendTrend', label: 'Trend of monthly spend', type: 'dropdown', hint: 'Steady, Increasing, Decreasing', options: ['Steady', 'Increasing', 'Decreasing', 'Fluctuating'] },
      { name: 'billingAccounts', label: 'Number of billing accounts', type: 'numeric', hint: 'Consolidated billing analysis' },
      { name: 'hasCredits', label: 'Current credits or discounts', type: 'dropdown', hint: 'Yes / No / Not sure', options: ['Yes', 'No', 'Not sure'] },
      { name: 'creditType', label: 'Type of credit', type: 'dropdown', hint: 'Partner, Promo, Startup, Other', options: ['Partner', 'Promo', 'Startup', 'Enterprise', 'Other', 'N/A'] },
      { name: 'billingCurrency', label: 'Billing currency', type: 'dropdown', hint: 'USD, SAR, AED, EUR', options: ['USD', 'SAR', 'AED', 'EUR', 'Other'] },
      { name: 'supportPlan', label: 'Support plan level', type: 'dropdown', hint: 'Standard, Enhanced, Premium', options: ['Standard', 'Enhanced', 'Premium', 'None'] },
      { name: 'paymentModel', label: 'Payment model', type: 'dropdown', hint: 'Postpaid, Prepaid, Marketplace-linked', options: ['Postpaid', 'Prepaid', 'Marketplace-linked', 'Other'] }
    ]
  },
  {
    id: 'C',
    title: 'Compute & Infrastructure',
    fields: [
      { name: 'avgInstances', label: 'Average number of Compute Engine instances', type: 'numeric', hint: 'From GCP Compute Dashboard' },
      { name: 'vmFamilies', label: 'VM Families used', type: 'multi-select', hint: 'E2,N2,C3,M2,T2D,A3 (GPU)', options: ['E2', 'N2', 'N1', 'C3', 'C2', 'M2', 'M1', 'T2D', 'A3 (GPU)', 'Other'] },
      { name: 'operatingSystems', label: 'Operating Systems', type: 'multi-select', hint: 'Linux, Windows, Container', options: ['Linux', 'Windows', 'Container-Optimized OS', 'Other'] },
      { name: 'avgCpuUtilization', label: 'Average CPU utilization', type: 'dropdown', hint: '<20%, 20-40%, 40-60%, 60-80%, >80%', options: ['<20%', '20-40%', '40-60%', '60-80%', '>80%'] },
      { name: 'autoscaling', label: 'Use of Autoscaling/Instance Groups', type: 'dropdown', hint: 'Yes / No / Planning', options: ['Yes', 'No', 'Planning'] },
      { name: 'spotVMs', label: 'Use of Spot or Preemptible VMs', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Planning'] },
      { name: 'useGKE', label: 'Use of Kubernetes (GKE)', type: 'dropdown', hint: 'Yes / No / Planning', options: ['Yes', 'No', 'Planning'] },
      { name: 'computeList', label: 'List of compute instances', type: 'upload', hint: 'CSV export' },
      { name: 'customMachines', label: 'Custom machine types used', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No'] },
      { name: 'gpuUsage', label: 'GPU or TPU usage', type: 'dropdown', hint: 'Yes / No', options: ['Yes - GPU', 'Yes - TPU', 'Both', 'No'] },
      { name: 'machineReport', label: 'Machine type report', type: 'upload', hint: 'Optional performance data' }
    ]
  },
  {
    id: 'D',
    title: 'Storage & Data Management',
    fields: [
      { name: 'totalStorage', label: 'Total Cloud Storage capacity (TB)', type: 'numeric', hint: 'Sum of all buckets' },
      { name: 'storageClasses', label: 'Storage class distribution', type: 'multi-select', hint: 'Standard, Nearline, Coldline, Archive', options: ['Standard', 'Nearline', 'Coldline', 'Archive'] },
      { name: 'dataGrowth', label: 'Data growth rate per month', type: 'dropdown', hint: '<5%, 5-10%, 10-20%, >20%', options: ['<5%', '5-10%', '10-20%', '>20%'] },
      { name: 'storageCost', label: 'Average monthly storage cost', type: 'numeric', hint: 'Approximate USD/SAR' },
      { name: 'replication', label: 'Use of replication or dual-region', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Planning'] },
      { name: 'persistentDisks', label: 'Use of Persistent Disks/Filestore', type: 'dropdown', hint: 'Yes / No', options: ['Yes - Persistent Disks', 'Yes - Filestore', 'Both', 'No'] },
      { name: 'bigQueryStorage', label: 'Use of BigQuery storage', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Planning'] },
      { name: 'storageReport', label: 'Storage report', type: 'upload', hint: 'Billing export' },
      { name: 'retentionPolicy', label: 'Retention/archival policies', type: 'dropdown', hint: '30, 90, 365 days, Indefinite', options: ['30 days', '90 days', '365 days', 'Indefinite', 'Custom'] },
      { name: 'dataPolicyDoc', label: 'Data Policy document', type: 'upload', hint: 'Optional' }
    ]
  },
  {
    id: 'E',
    title: 'Networking',
    fields: [
      { name: 'activeVPCs', label: 'Number of active VPCs', type: 'numeric', hint: 'GCP VPC count' },
      { name: 'interconnect', label: 'Use of Interconnect/VPN', type: 'multi-select', hint: 'Interconnect, VPN, Peering', options: ['Cloud Interconnect', 'Cloud VPN', 'VPC Peering', 'None'] },
      { name: 'networkEgress', label: 'Average network egress (GB/month)', type: 'numeric', hint: 'From Network metrics' },
      { name: 'crossRegion', label: 'Cross-region data transfer usage', type: 'dropdown', hint: 'High, Moderate, Low', options: ['High', 'Moderate', 'Low', 'None'] },
      { name: 'loadBalancers', label: 'Load balancers configured', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Planning'] },
      { name: 'cloudArmor', label: 'Use of Cloud Armor/CDN', type: 'dropdown', hint: 'Yes / No', options: ['Cloud Armor only', 'CDN only', 'Both', 'None'] },
      { name: 'networkDiagram', label: 'Network topology diagram', type: 'upload', hint: 'Optional' }
    ]
  },
  {
    id: 'F',
    title: 'Databases & Analytics',
    fields: [
      { name: 'databases', label: 'Databases in use', type: 'multi-select', hint: 'Cloud SQL, Firestore, Spanner, BigQuery', options: ['Cloud SQL', 'Cloud Firestore', 'Cloud Spanner', 'BigQuery', 'Bigtable', 'Memorystore', 'Other'] },
      { name: 'dbStorageSize', label: 'Average DB storage size (GB/TB)', type: 'numeric', hint: 'Per DB' },
      { name: 'queryFrequency', label: 'Query frequency', type: 'dropdown', hint: 'Real-time, Batch (daily), Batch (weekly)', options: ['Real-time', 'Batch (daily)', 'Batch (weekly)', 'On-demand', 'Mixed'] },
      { name: 'dataRetention', label: 'Retention period for data', type: 'dropdown', hint: '1m, 3m, 6m, 12m, 3y', options: ['1 month', '3 months', '6 months', '12 months', '3 years', 'Indefinite'] },
      { name: 'dbReport', label: 'DB list and cost report', type: 'upload', hint: 'Billing export' },
      { name: 'migrationPlan', label: 'Migration plan to GCP databases', type: 'dropdown', hint: 'Yes / No / Evaluating', options: ['Yes', 'No', 'Evaluating'] },
      { name: 'dataWarehouse', label: 'Planned data warehouse initiatives', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Evaluating'] }
    ]
  },
  {
    id: 'G',
    title: 'Security, Monitoring & Compliance',
    fields: [
      { name: 'iamModel', label: 'IAM management model', type: 'dropdown', hint: 'Centralized, Decentralized, Mixed', options: ['Centralized', 'Decentralized', 'Mixed'] },
      { name: 'auditLogging', label: 'Audit logging enabled', type: 'dropdown', hint: 'Yes / No / Partial', options: ['Yes', 'No', 'Partial'] },
      { name: 'securityCenter', label: 'Use of Security Command Center (SCC)', type: 'dropdown', hint: 'Yes / No / Evaluating', options: ['Yes', 'No', 'Evaluating'] },
      { name: 'cloudMonitoring', label: 'Use of Cloud Monitoring/Ops Suite', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Evaluating'] },
      { name: 'thirdPartyTools', label: 'Third-party tools integrated', type: 'multi-select', hint: 'Datadog, Grafana, Prometheus', options: ['Datadog', 'Grafana', 'Prometheus', 'Splunk', 'New Relic', 'None', 'Other'] },
      { name: 'complianceDocs', label: 'Security/Compliance report', type: 'upload', hint: 'ISO, NCA, PDPL docs' }
    ]
  },
  {
    id: 'H',
    title: 'Future Plans (12-36 Months Forecast)',
    fields: [
      { name: 'newWorkloads', label: 'New workloads planned', type: 'multi-select', hint: 'AI/ML, IoT, Analytics, SAP', options: ['AI/ML', 'IoT', 'Analytics', 'SAP', 'Data Lakes', 'Microservices', 'Other'] },
      { name: 'budgetGrowth', label: 'Estimated budget growth', type: 'dropdown', hint: '0-10%, 10-25%, 25-50%, >50%', options: ['0-10%', '10-25%', '25-50%', '>50%'] },
      { name: 'newRegions', label: 'Planned new regions', type: 'multi-select', hint: 'asia-south1, europe-west1, us-central1', options: ['asia-south1', 'europe-west1', 'us-central1', 'us-east1', 'australia-southeast1', 'Other'] },
      { name: 'newServices', label: 'Expected services adoption', type: 'multi-select', hint: 'Vertex AI, Cloud Run, Dataflow, Pub/Sub', options: ['Vertex AI', 'Cloud Run', 'Dataflow', 'Pub/Sub', 'Cloud Functions', 'Apigee', 'Anthos', 'Other'] },
      { name: 'cloudMigration', label: 'Migration from other clouds', type: 'dropdown', hint: 'Yes / No / Maybe', options: ['Yes', 'No', 'Maybe'] },
      { name: 'commitmentDuration', label: 'Preferred commitment duration', type: 'dropdown', hint: '12, 24, 36 months', options: ['12 months', '24 months', '36 months', 'Flexible'] },
      { name: 'paymentSchedule', label: 'Preferred payment schedule', type: 'dropdown', hint: 'Monthly, Annual, Prepaid', options: ['Monthly', 'Annual', 'Prepaid', 'Quarterly'] },
      { name: 'roadmapDoc', label: 'Future project roadmap', type: 'upload', hint: 'Optional document' }
    ]
  },
  {
    id: 'I',
    title: 'Business & Financial Alignment',
    fields: [
      { name: 'costAllocation', label: 'Cost allocation model', type: 'dropdown', hint: 'Per Project, Dept, Centralized', options: ['Per Project', 'Per Department', 'Centralized', 'Hybrid'] },
      { name: 'budgetAlerts', label: 'Budget alert mechanism', type: 'dropdown', hint: 'Enabled/Disabled', options: ['Enabled', 'Disabled', 'Partial'] },
      { name: 'costReduction', label: 'Target cost reduction %', type: 'dropdown', hint: '10%, 20%, 30%, >30%', options: ['10%', '20%', '30%', '>30%', 'N/A'] },
      { name: 'approvalWorkflow', label: 'Approval workflow for new workloads', type: 'dropdown', hint: 'Automated/Manual', options: ['Automated', 'Manual', 'Hybrid'] },
      { name: 'marketplaceSolutions', label: 'Use of Marketplace solutions', type: 'dropdown', hint: 'Yes / No', options: ['Yes', 'No', 'Evaluating'] },
      { name: 'complianceReqs', label: 'Compliance requirements', type: 'multi-select', hint: 'PDPL, NCA, ISO27001', options: ['PDPL', 'NCA', 'ISO27001', 'SOC2', 'GDPR', 'HIPAA', 'Other'] },
      { name: 'costOptReports', label: 'Cost optimization reports', type: 'upload', hint: 'Optional' }
    ]
  },
  {
    id: 'J',
    title: 'Additional Notes/Attachments',
    fields: [
      { name: 'otherServices', label: 'Other GCP services in use', type: 'multi-select', hint: 'Cloud Run, Cloud Functions, API Gateway', options: ['Cloud Run', 'Cloud Functions', 'API Gateway', 'Cloud Tasks', 'Cloud Scheduler', 'Workflows', 'Other'] },
      { name: 'archDiagrams', label: 'Architectural diagrams', type: 'upload', hint: 'Optional' },
      { name: 'policyDocs', label: 'Policy documents', type: 'upload', hint: 'Optional' },
      { name: 'additionalComments', label: 'Additional comments', type: 'textarea', hint: 'Free notes' }
    ]
  }
];
