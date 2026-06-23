locals {
  location_short = {
    uksouth = "uks"
    ukwest  = "ukw"
  }
  loc = local.location_short[var.location]

  is_pe_env           = var.env == "nft" || var.env == "stg" || var.env == "prod"
  apim_name           = local.is_pe_env ? "apim-internal-mhpd-${var.env}-${local.loc}" : "apim-mhpd-${var.env}-${local.loc}"
  apim_resource_group = "rg-mhpd-${var.env}-apim-${var.location}"

  api_management_logger_id = "/subscriptions/${var.subscription_id}/resourceGroups/${local.apim_resource_group}/providers/Microsoft.ApiManagement/service/${local.apim_name}/loggers/apim-logger-mhpd-${var.env}"

  # This component only ever runs from the UKSouth stage (multiRegionComponent: true in
  # stages.yml), so Active-Active routing is done at request time in policy via
  # context.Deployment.Region instead of Terraform-level location switching.
  cda_backend_url_uks = "https://cda-service-uks-${var.env}.azurewebsites.net"
  cda_backend_url_ukw = "https://cda-service-ukw-${var.env}.azurewebsites.net"
}
