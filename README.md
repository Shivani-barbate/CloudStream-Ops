# CloudStream-Ops

Enterprise-grade cloud-native event-driven platform built on Microsoft Azure and Azure Kubernetes Service (AKS).

---

## Architecture

Client
↓
API Service (AKS)
↓
Azure Event Hub
↓
Worker Service (AKS)
↓
Azure Function
↓
Processing Layer

Monitoring:
Prometheus + Grafana

Observability:
Application Insights + Log Analytics

Security:
Managed Identity + Azure Key Vault + CSI Driver + TLS

CI/CD:
Azure DevOps Multi-Stage Pipeline

---

## Solution Overview

CloudStream-Ops demonstrates an enterprise event-driven architecture deployed on Azure using Kubernetes, Event Hub messaging, Azure Functions, Infrastructure as Code, monitoring, observability, and automated CI/CD pipelines.

The platform receives requests through an API running on AKS, publishes events to Azure Event Hub, processes them using a worker service, and triggers Azure Functions for downstream processing.

---

## Technologies Used

### Cloud

- Microsoft Azure
- Azure Kubernetes Service (AKS)
- Azure Container Registry (ACR)
- Azure Event Hub
- Azure Functions
- Azure Key Vault
- Azure Managed Identity
- Application Insights
- Log Analytics

### Containers & Orchestration

- Docker
- Kubernetes
- Ingress NGINX
- Horizontal Pod Autoscaler

### DevOps

- Azure DevOps
- YAML Pipelines
- GitHub

### Monitoring

- Prometheus
- Grafana
- OpenTelemetry

### Infrastructure as Code

- Bicep

---

## Architecture Components

### API Service

Responsibilities:

- Receives incoming requests
- Publishes events to Azure Event Hub
- Exposes REST APIs

### Worker Service

Responsibilities:

- Consumes Event Hub messages
- Processes business events
- Invokes Azure Functions

### Azure Function

Responsibilities:

- Serverless event processing
- Downstream integrations
- Business workflow execution

### Azure Event Hub

Responsibilities:

- Event streaming
- Decoupled communication
- Scalable messaging backbone

---

## Security

### Managed Identity

Used for:

- Event Hub access
- Key Vault access

### Azure Key Vault

Stores:

- Event Hub secrets
- Application configuration

### Secrets Store CSI Driver

Provides:

- Secure secret injection into AKS pods
- Secret rotation support

### TLS Certificates

Implemented using:

- cert-manager
- Let's Encrypt
- NGINX Ingress

---

## Monitoring & Observability

### Prometheus

Metrics collection from:

- Kubernetes cluster
- API Service
- Worker Service

### Grafana

Dashboards:

- Cluster Health
- Pod Health
- Resource Utilization
- Application Metrics

### Application Insights

Tracks:

- Requests
- Dependencies
- Exceptions
- Distributed Tracing

### Log Analytics

Centralized logging and diagnostics.

---

## CI/CD Pipeline

Azure DevOps Multi-Stage Pipeline

Stages:

### Build

- Build API image
- Build Worker image
- Push images to ACR

### DEV

- Deploy to AKS DEV environment

### UAT

- Deploy to AKS UAT environment

### PROD

- Deploy to AKS PROD environment

---

## Kubernetes Resources

Implemented:

- Deployments
- Services
- Ingress
- HPA
- Service Accounts
- ConfigMaps
- Secrets
- Certificate Resources

---

## Infrastructure Provisioned

### Resource Groups

- rg-cloudstream-dev
- rg-cloudstream-uat
- rg-cloudstream-prod

### AKS

- aks-cloudstream-dev

### ACR

- cloudstreamacrshivani001

### Event Hub

- cloudstream-eh-ns
- orders

### Key Vault

- kv-cloudstream-dev

---

## Project Highlights

✔ Event-Driven Architecture

✔ Azure Kubernetes Service

✔ Azure Functions Integration

✔ Managed Identity Authentication

✔ Azure Key Vault CSI Driver

✔ TLS / HTTPS with Let's Encrypt

✔ Prometheus Monitoring

✔ Grafana Dashboards

✔ Application Insights Tracing

✔ Log Analytics Integration

✔ Azure DevOps Multi-Stage CI/CD

✔ Infrastructure as Code using Bicep

---

## Future Enhancements

### Future Enhancements

* Azure Monitor Managed Prometheus
* Azure Managed Grafana
* Event Hub Dead Letter Processing
* Blob-based Event Hub Checkpointing
* Canary Deployments
* Blue-Green Deployments
* Chaos Testing
* Security Scanning with Trivy
* Azure Policy for AKS Governance
* Cost Optimization Dashboards


---
### Results & Achievements

* Successfully deployed a cloud-native event-driven application on Azure Kubernetes Service (AKS).
* Implemented multi-environment deployments (DEV, UAT, PROD) using Azure DevOps multi-stage pipelines.
* Secured application secrets using Azure Key Vault and CSI Driver integration.
* Implemented Azure Workload Identity for secure pod-to-Azure authentication.
* Integrated Azure Event Hub for asynchronous message processing.
* Developed a Worker Service that consumes events and invokes Azure Functions.
* Enabled end-to-end observability using Application Insights, Log Analytics, Prometheus, and Grafana.
* Configured Horizontal Pod Autoscaling (HPA) for workload scalability.
* Implemented TLS certificates using Cert-Manager and Let's Encrypt.
* Built a production-style GitOps-ready repository structure with Infrastructure as Code and Kubernetes manifests.

----

## Author

Shivani Barbate

DevOps Engineer | Azure | Kubernetes | CI/CD | Cloud Native