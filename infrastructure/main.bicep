param location string = resourceGroup().location
param prefix string = 'cloudstream'
param env string = 'dev'

module acr './acr/main.bicep' = {
  name: 'acrDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
  }
}

module monitoring './monitoring/main.bicep' = {
  name: 'monitoringDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
  }
}

module cosmos './cosmos/main.bicep' = {
  name: 'cosmosDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
  }
}

module keyvault './keyvault/main.bicep' = {
  name: 'keyVaultDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
  }
}

module function './function/main.bicep' = {
  name: 'functionDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
    appInsightsConnectionString: monitoring.outputs.appInsightsKey
  }
}

module aks './aks/main.bicep' = {
  name: 'aksDeploy'
  params: {
    location: location
    prefix: prefix
    env: env
    acrId: acr.outputs.acrId
    workspaceId: monitoring.outputs.workspaceId
  }
}
