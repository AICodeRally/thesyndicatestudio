# Integration Framework

## Overview

This document describes integration capabilities with external systems, data sources, and platforms commonly used in sales and finance operations.

---

## Table of Contents

1. [CRM Integrations](#crm-integrations)
2. [SPM Platform Integrations](#spm-platform-integrations)
3. [Data Warehouse & Analytics](#data-warehouse--analytics)
4. [ERP & Financial Systems](#erp--financial-systems)
5. [HR Systems](#hr-systems)
6. [Cloud Storage & Collaboration](#cloud-storage--collaboration)
7. [API Framework](#api-framework)
8. [Data Pipeline Automation](#data-pipeline-automation)

---

## CRM Integrations

### 1.1 Salesforce Integration

**Purpose**: Pull performance data, opportunities, and account information

```python
from spm_monte_carlo.integrations import SalesforceConnector

sf = SalesforceConnector()

# Authenticate
sf.authenticate(
    instance='company.salesforce.com',
    username='integration@company.com',
    password='password',
    security_token='token',
    # OR use OAuth
    client_id='client_id',
    client_secret='client_secret'
)

# Pull opportunity data
opportunities = sf.query("""
    SELECT Id, AccountId, Amount, StageName, CloseDate,
           OwnerId, Probability, Type
    FROM Opportunity
    WHERE CloseDate >= THIS_FISCAL_YEAR
    AND OwnerId IN :rep_ids
""", params={'rep_ids': rep_ids})

# Pull quota data (if using Salesforce quotas)
quotas = sf.get_quotas(
    fiscal_period='2025',
    user_ids=rep_ids
)

# Pull account territory assignments
territories = sf.query("""
    SELECT Id, Territory2Id, AccountId
    FROM ObjectTerritory2Association
    WHERE Territory2Id IN :territory_ids
""", params={'territory_ids': territory_ids})

# Use in simulation
simulator.load_from_salesforce(
    opportunities=opportunities,
    quotas=quotas,
    territories=territories
)

# Push results back to Salesforce (custom object)
sf.upsert(
    object_name='Monte_Carlo_Forecast__c',
    records=forecast_records,
    external_id_field='Forecast_Id__c'
)
```

**Salesforce Objects Supported**:
- Opportunity
- Account
- User (rep data)
- Territory2, ObjectTerritory2Association
- Custom objects (quota tracking, compensation plans)
- Reports and Dashboards

**Real-time vs. Batch**:
- **Real-time**: REST API for small queries
- **Batch**: Bulk API for large data volumes

---

### 1.2 Microsoft Dynamics 365 Integration

```python
from spm_monte_carlo.integrations import DynamicsConnector

dynamics = DynamicsConnector()

# Connect
dynamics.connect(
    org_url='https://company.crm.dynamics.com',
    client_id='client_id',
    client_secret='client_secret',
    tenant_id='tenant_id'
)

# Fetch opportunities
opportunities = dynamics.fetch_entity(
    entity='opportunity',
    columns=['opportunityid', 'name', 'estimatedvalue', 'statecode', 'ownerid'],
    filter="statecode eq 0 and ownerid in ({})"
)

# Fetch quotas
quotas = dynamics.fetch_entity(
    entity='goalrollupquery',
    columns=['goalrollupqueryid', 'name', 'fetchxml']
)

# Load into simulation
simulator.load_from_dynamics(opportunities, quotas)
```

---

### 1.3 HubSpot Integration

```python
from spm_monte_carlo.integrations import HubSpotConnector

hubspot = HubSpotConnector()

# Authenticate
hubspot.authenticate(api_key='api_key')

# Get deals
deals = hubspot.get_deals(
    properties=['dealname', 'amount', 'closedate', 'dealstage', 'hubspot_owner_id'],
    filters={'closedate__gte': '2025-01-01'}
)

# Get owners (reps)
owners = hubspot.get_owners()

# Load
simulator.load_from_hubspot(deals, owners)
```

---

## SPM Platform Integrations

### 2.1 Xactly Integration

**Purpose**: Integrate with Xactly Incent (SPM platform)

```python
from spm_monte_carlo.integrations import XactlyConnector

xactly = XactlyConnector()

# Connect
xactly.connect(
    api_url='https://api.xactlycorp.com',
    client_id='client_id',
    client_secret='client_secret'
)

# Get compensation plans
plans = xactly.get_plans(effective_date='2025-01-01')

# Get participant data
participants = xactly.get_participants()

# Get historical payments
payments = xactly.get_payments(
    start_date='2024-01-01',
    end_date='2024-12-31'
)

# Load historical performance for distribution fitting
historical_data = xactly.get_performance_metrics(
    participants=participants,
    period='2024'
)

# Use in simulation
simulator.load_plan_from_xactly(plans)
simulator.load_historical_from_xactly(historical_data)

# Run simulation
results = simulator.run()

# Push forecast back to Xactly
xactly.upload_forecast(results.to_xactly_format())
```

---

### 2.2 Anaplan Integration

**Purpose**: Integrate with Anaplan for planning and forecasting

```python
from spm_monte_carlo.integrations import AnaplanConnector

anaplan = AnaplanConnector()

# Connect
anaplan.connect(
    workspace_id='workspace_id',
    model_id='model_id',
    auth=('username', 'password')
)

# Export data from Anaplan
quota_data = anaplan.export_module(
    module_name='Sales Quotas',
    view_name='FY2025 Quotas'
)

territory_data = anaplan.export_module(
    module_name='Territory Assignments',
    view_name='Current Assignments'
)

# Load into simulation
simulator.load_quotas(quota_data)
simulator.load_territories(territory_data)

# Run simulation
results = simulator.run()

# Import results back to Anaplan
anaplan.import_module(
    module_name='Comp Forecast',
    data=results.to_anaplan_format()
)
```

---

### 2.3 Varicent (formerly IBM Incentive Compensation Management)

```python
from spm_monte_carlo.integrations import VaricentConnector

varicent = VaricentConnector()

# Connect via SOAP API
varicent.connect(
    wsdl_url='https://company.varicent.com/services?wsdl',
    username='integration_user',
    password='password'
)

# Get plan structure
plan_xml = varicent.get_plan_definition(plan_id='PLAN_2025')
plan = varicent.parse_plan_xml(plan_xml)

# Get participant assignments
participants = varicent.get_participants(plan_id='PLAN_2025')

# Load
simulator.load_plan_from_varicent(plan)
simulator.load_participants(participants)
```

---

## Data Warehouse & Analytics

### 3.1 Snowflake Integration

**Purpose**: Read/write to Snowflake data warehouse

```python
from spm_monte_carlo.integrations import SnowflakeConnector

snowflake = SnowflakeConnector()

# Connect
snowflake.connect(
    account='company.snowflakecomputing.com',
    user='spm_analytics',
    password='password',
    warehouse='ANALYTICS_WH',
    database='SALES_DATA',
    schema='COMPENSATION'
)

# Read data
query = """
SELECT
    rep_id,
    fiscal_period,
    quota_attainment_pct,
    total_revenue,
    total_compensation
FROM rep_performance
WHERE fiscal_year = 2024
"""

historical_data = snowflake.query(query)

# Load into simulator
simulator.load_data(historical_data)

# Run simulation
results = simulator.run()

# Write results to Snowflake
snowflake.write_table(
    table_name='monte_carlo_results',
    data=results.to_dataframe(),
    if_exists='replace'
)

# Create view for BI tools
snowflake.execute("""
CREATE OR REPLACE VIEW vw_mc_summary AS
SELECT
    scenario_id,
    simulation_date,
    avg(total_compensation) as avg_comp,
    percentile_cont(0.50) within group (order by total_compensation) as median_comp,
    percentile_cont(0.95) within group (order by total_compensation) as var_95
FROM monte_carlo_results
GROUP BY scenario_id, simulation_date
""")
```

---

### 3.2 Amazon Redshift Integration

```python
from spm_monte_carlo.integrations import RedshiftConnector

redshift = RedshiftConnector()

# Connect
redshift.connect(
    host='company.redshift.amazonaws.com',
    port=5439,
    database='analytics',
    user='analyst',
    password='password'
)

# Read with query
data = redshift.query("""
    SELECT * FROM sales_performance
    WHERE year = 2024
""")

# Write results
redshift.write(
    table='monte_carlo_forecasts',
    data=results.to_dataframe(),
    schema='compensation'
)
```

---

### 3.3 Google BigQuery Integration

```python
from spm_monte_carlo.integrations import BigQueryConnector

bq = BigQueryConnector()

# Authenticate
bq.authenticate(
    project_id='company-analytics',
    credentials_path='service_account.json'
)

# Read data
query = """
SELECT
    rep_id,
    DATE_TRUNC(close_date, MONTH) as period,
    SUM(amount) as revenue,
    COUNT(*) as deal_count
FROM `company-analytics.sales.opportunities`
WHERE EXTRACT(YEAR FROM close_date) = 2024
GROUP BY rep_id, period
"""

data = bq.query(query)

# Write results
bq.write(
    table='compensation.monte_carlo_results',
    data=results.to_dataframe(),
    write_disposition='WRITE_TRUNCATE'
)
```

---

### 3.4 Databricks Integration

```python
from spm_monte_carlo.integrations import DatabricksConnector

databricks = DatabricksConnector()

# Connect
databricks.connect(
    host='company.cloud.databricks.com',
    token='access_token',
    cluster_id='cluster_id'
)

# Read from Delta table
data = databricks.read_table(
    catalog='sales',
    schema='performance',
    table='rep_metrics'
)

# Run computation on Databricks (distributed)
results = databricks.run_distributed_simulation(
    simulator_config=config,
    parallelism=100  # 100 worker nodes
)

# Write to Delta table
databricks.write_table(
    catalog='analytics',
    schema='compensation',
    table='monte_carlo_forecasts',
    data=results,
    mode='overwrite'
)
```

---

## ERP & Financial Systems

### 4.1 NetSuite Integration

**Purpose**: Sync with financial planning and actuals

```python
from spm_monte_carlo.integrations import NetSuiteConnector

netsuite = NetSuiteConnector()

# Connect via SuiteTalk (SOAP)
netsuite.connect(
    account_id='account_id',
    consumer_key='consumer_key',
    consumer_secret='consumer_secret',
    token_id='token_id',
    token_secret='token_secret'
)

# Get budget data
budget = netsuite.search(
    record_type='Budget',
    filters={
        'subsidiary': 'Main Company',
        'year': 2025,
        'category': 'Sales Compensation'
    }
)

# Get actuals
actuals = netsuite.search(
    record_type='TransactionLine',
    filters={
        'account': 'Compensation Expense',
        'period': '2024'
    }
)

# Use in simulation
simulator.set_budget(budget)
simulator.compare_to_actuals(actuals)
```

---

### 4.2 SAP Integration

```python
from spm_monte_carlo.integrations import SAPConnector

sap = SAPConnector()

# Connect via RFC
sap.connect(
    ashost='sap.company.com',
    sysnr='00',
    client='100',
    user='INTEGRATION',
    passwd='password'
)

# Call BAPI
budget_data = sap.call_bapi(
    bapi_name='BAPI_COSTCENTER_GETLIST',
    parameters={'CONTROLLING_AREA': '1000'}
)

# Get HR data for reps
employee_data = sap.call_bapi(
    bapi_name='BAPI_EMPLOYEE_GETLIST',
    parameters={'ORG_UNIT': 'SALES'}
)

# Load
simulator.load_employee_data(employee_data)
```

---

### 4.3 Workday Integration

**Purpose**: HR and financial data

```python
from spm_monte_carlo.integrations import WorkdayConnector

workday = WorkdayConnector()

# Connect
workday.connect(
    tenant='company',
    username='integration@company',
    password='password'
)

# Get employee data
employees = workday.get_workers(
    worker_type='Employee',
    job_family='Sales'
)

# Get compensation data
compensation = workday.get_compensation_data(
    workers=employees,
    effective_date='2024-12-31'
)

# Get organizational structure
org_structure = workday.get_organization_tree(
    organization_id='Sales_Org'
)

# Load
simulator.load_from_workday(
    employees=employees,
    compensation=compensation,
    org_structure=org_structure
)
```

---

## HR Systems

### 5.1 ADP Integration

```python
from spm_monte_carlo.integrations import ADPConnector

adp = ADPConnector()

# Connect via API
adp.connect(
    client_id='client_id',
    client_secret='client_secret',
    ssl_cert_path='cert.pem'
)

# Get employee roster
employees = adp.get_workers(
    department='Sales'
)

# Get payroll data
payroll = adp.get_payroll_results(
    pay_period='2024'
)

# Load
simulator.load_employee_roster(employees)
simulator.load_payroll_actuals(payroll)
```

---

### 5.2 BambooHR Integration

```python
from spm_monte_carlo.integrations import BambooHRConnector

bamboo = BambooHRConnector()

# Connect
bamboo.connect(
    subdomain='company',
    api_key='api_key'
)

# Get employee directory
employees = bamboo.get_employees(
    fields=['firstName', 'lastName', 'department', 'jobTitle', 'hireDate']
)

# Get custom compensation fields
comp_data = bamboo.get_custom_fields(
    fields=['quota', 'target_incentive', 'territory']
)

# Load
simulator.load_employee_data(employees, comp_data)
```

---

## Cloud Storage & Collaboration

### 6.1 AWS S3 Integration

```python
from spm_monte_carlo.integrations import S3Connector

s3 = S3Connector()

# Connect
s3.connect(
    aws_access_key_id='access_key',
    aws_secret_access_key='secret_key',
    region_name='us-east-1'
)

# Read Excel from S3
data = s3.read_excel(
    bucket='company-analytics',
    key='compensation/input/historical_data.xlsx'
)

# Write results to S3
s3.write_excel(
    bucket='company-analytics',
    key='compensation/output/monte_carlo_results.xlsx',
    data=results.to_excel()
)

# Upload report
s3.upload_file(
    file_path='monthly_report.pdf',
    bucket='company-reports',
    key='compensation/2024-11/report.pdf'
)
```

---

### 6.2 Google Drive Integration

```python
from spm_monte_carlo.integrations import GoogleDriveConnector

gdrive = GoogleDriveConnector()

# Authenticate
gdrive.authenticate(
    credentials_file='credentials.json',
    scopes=['https://www.googleapis.com/auth/drive']
)

# Read Excel from Drive
file_id = gdrive.find_file('Historical Performance Data.xlsx')
data = gdrive.download_excel(file_id)

# Upload results
gdrive.upload_file(
    file_path='results.xlsx',
    folder_id='folder_id',
    filename='Monte Carlo Results.xlsx'
)

# Share with team
gdrive.share_file(
    file_id=uploaded_file_id,
    email_addresses=['team@company.com'],
    role='reader'
)
```

---

### 6.3 SharePoint Integration

```python
from spm_monte_carlo.integrations import SharePointConnector

sharepoint = SharePointConnector()

# Connect
sharepoint.connect(
    site_url='https://company.sharepoint.com/sites/Finance',
    username='integration@company.com',
    password='password'
)

# Download file
data = sharepoint.download_file(
    folder='/Shared Documents/Compensation/Input',
    filename='quotas_2025.xlsx'
)

# Upload results
sharepoint.upload_file(
    local_path='results.xlsx',
    folder='/Shared Documents/Compensation/Output',
    filename='Monte_Carlo_Results_2024-11.xlsx'
)

# Create folder structure
sharepoint.create_folder_structure([
    '/Shared Documents/Compensation/Archive/2024',
    '/Shared Documents/Compensation/Archive/2025'
])
```

---

## API Framework

### 7.1 RESTful API Server

**Purpose**: Expose Monte Carlo functionality via REST API

```python
from spm_monte_carlo.api import APIServer

api = APIServer()

# Start server
api.start(
    host='0.0.0.0',
    port=8000,
    auth='api_key'  # or 'oauth', 'jwt'
)

# API Endpoints:
# POST /api/v1/simulations
# GET /api/v1/simulations/{simulation_id}
# GET /api/v1/simulations/{simulation_id}/results
# POST /api/v1/simulations/{simulation_id}/export
# GET /api/v1/distributions
# POST /api/v1/optimize
```

**Example API Usage**:
```bash
# Create simulation
curl -X POST http://localhost:8000/api/v1/simulations \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Forecast",
    "iterations": 10000,
    "config": {...}
  }'

# Response
{
  "simulation_id": "sim_abc123",
  "status": "queued"
}

# Check status
curl http://localhost:8000/api/v1/simulations/sim_abc123 \
  -H "X-API-Key: your_api_key"

# Response
{
  "simulation_id": "sim_abc123",
  "status": "completed",
  "progress": 100,
  "results_url": "/api/v1/simulations/sim_abc123/results"
}

# Get results
curl http://localhost:8000/api/v1/simulations/sim_abc123/results \
  -H "X-API-Key: your_api_key"
```

---

### 7.2 Webhooks

**Purpose**: Push notifications when simulations complete

```python
from spm_monte_carlo.api import WebhookManager

webhooks = WebhookManager()

# Register webhook
webhooks.register(
    url='https://company.com/api/monte-carlo-webhook',
    events=['simulation.completed', 'simulation.failed'],
    secret='webhook_secret'
)

# When simulation completes, POST to webhook:
# {
#   "event": "simulation.completed",
#   "simulation_id": "sim_abc123",
#   "timestamp": "2024-11-20T10:30:00Z",
#   "data": {
#     "mean": 5245000,
#     "var_95": 6140000,
#     ...
#   }
# }
```

---

### 7.3 GraphQL API

**Alternative to REST for flexible queries**:

```python
from spm_monte_carlo.api import GraphQLServer

graphql = GraphQLServer()

graphql.start(port=8001)

# Example query:
"""
{
  simulation(id: "sim_abc123") {
    id
    name
    status
    results {
      summary {
        mean
        median
        var95
      }
      byRole {
        role
        avgCompensation
      }
    }
  }
}
"""
```

---

## Data Pipeline Automation

### 8.1 Apache Airflow Integration

**Purpose**: Schedule and orchestrate data pipelines

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from spm_monte_carlo import MonteCarloSimulator
from datetime import datetime, timedelta

default_args = {
    'owner': 'compensation_team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'monthly_compensation_forecast',
    default_args=default_args,
    schedule_interval='0 8 5 * *',  # 8am on 5th of month
    start_date=datetime(2025, 1, 1)
)

def extract_data():
    """Pull data from Salesforce and Snowflake"""
    # ... extraction logic
    pass

def run_simulation():
    """Run Monte Carlo simulation"""
    simulator = MonteCarloSimulator()
    simulator.load_config('monthly_forecast_config.yaml')
    results = simulator.run()
    results.export('/output/monthly_forecast.xlsx')

def publish_results():
    """Upload to SharePoint and send notifications"""
    # ... publishing logic
    pass

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data,
    dag=dag
)

simulate_task = PythonOperator(
    task_id='run_simulation',
    python_callable=run_simulation,
    dag=dag
)

publish_task = PythonOperator(
    task_id='publish_results',
    python_callable=publish_results,
    dag=dag
)

extract_task >> simulate_task >> publish_task
```

---

### 8.2 Azure Data Factory Integration

```python
from spm_monte_carlo.integrations import AzureDataFactoryConnector

adf = AzureDataFactoryConnector()

# Connect
adf.connect(
    subscription_id='sub_id',
    resource_group='analytics-rg',
    factory_name='company-adf',
    credentials=credentials
)

# Trigger pipeline
adf.trigger_pipeline(
    pipeline_name='compensation_pipeline',
    parameters={
        'simulation_config': 'monthly_forecast',
        'output_path': '/output/results.xlsx'
    }
)

# Monitor
status = adf.get_pipeline_run_status(run_id)
```

---

### 8.3 dbt Integration

**Purpose**: Transform data in warehouse before simulation

```yaml
# dbt model: models/compensation/rep_performance_monthly.sql
with opportunities as (
    select * from {{ ref('stg_salesforce_opportunities') }}
),
quotas as (
    select * from {{ ref('stg_quota_assignments') }}
)

select
    o.owner_id as rep_id,
    date_trunc('month', o.close_date) as period,
    sum(o.amount) as total_revenue,
    count(*) as deal_count,
    q.quota,
    sum(o.amount) / q.quota as quota_attainment_pct
from opportunities o
join quotas q on o.owner_id = q.rep_id
    and date_trunc('month', o.close_date) = q.period
where o.is_won = true
group by 1, 2, 5
```

```python
# Use dbt-prepared data in simulation
from spm_monte_carlo.integrations import dbtConnector

dbt = dbtConnector()
dbt.connect(warehouse_connection)

# Run dbt models
dbt.run_models(['compensation.*'])

# Load results
data = dbt.read_model('compensation.rep_performance_monthly')

# Use in simulation
simulator.load_data(data)
```

---

### 8.4 Event-Driven Architecture

**Trigger simulations based on events**:

```python
from spm_monte_carlo.integrations import EventListener

listener = EventListener()

# Listen for events
listener.subscribe(
    topic='salesforce.opportunity.closed',
    handler=lambda event: trigger_simulation_if_threshold(event)
)

listener.subscribe(
    topic='quota.updated',
    handler=lambda event: trigger_reforecast(event)
)

def trigger_simulation_if_threshold(event):
    """Re-run forecast if significant opportunity closed"""
    if event['amount'] > 500_000:
        simulator.run(trigger='large_deal_closed')

def trigger_reforecast(event):
    """Re-run if quotas changed"""
    simulator.load_quotas(event['new_quotas'])
    simulator.run(trigger='quota_updated')

listener.start()
```

---

## Security & Authentication

### 9.1 OAuth 2.0

```python
from spm_monte_carlo.integrations.auth import OAuth2Handler

oauth = OAuth2Handler()

# Configure
oauth.configure(
    client_id='client_id',
    client_secret='client_secret',
    authorization_url='https://provider.com/oauth/authorize',
    token_url='https://provider.com/oauth/token',
    redirect_uri='https://app.company.com/callback'
)

# Get authorization URL
auth_url = oauth.get_authorization_url()

# Exchange code for token
token = oauth.exchange_code_for_token(code)

# Use token for API calls
headers = {'Authorization': f'Bearer {token["access_token"]}'}
```

---

### 9.2 API Key Management

```python
from spm_monte_carlo.integrations.auth import APIKeyManager

keys = APIKeyManager()

# Generate API key
api_key = keys.generate_key(
    name='Salesforce Integration',
    permissions=['read:data', 'write:results'],
    expires_in_days=365
)

# Validate key
is_valid = keys.validate(api_key)

# Revoke key
keys.revoke(api_key)
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Status**: Design Phase - Integration Features
