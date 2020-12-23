module "api" {
  source                 = "../modules/instance"
  availability_zone      = module.network.availability_zone_a
  subnet_id              = module.network.public_subnet_a.id
  vpc_security_group_ids = [module.network.instance_security_group.id]
  project_name           = var.project_name
  user_data              = data.local_file.user_data.content
}

module "database" {
  source                 = "../modules/database"
  project_name           = var.project_name
  subnet_ids             = [module.network.private_subnet_a.id, module.network.private_subnet_b.id]
  vpc_security_group_ids = [module.network.db_security_group.id]
  username               = var.username
  password               = var.password
}

module "api_repository" {
  source          = "../modules/repositories"
  repository_name = format("%s-api", var.project_name)
}

# We will run jobs inside EC2 for now, until AWS Lambda supports Docker in Sydney will we then migrate
module "jobs_repository" {
  source          = "../modules/repositories"
  repository_name = format("%s-jobs", var.project_name)
}

module "network" {
  source       = "../modules/network"
  project_name = var.project_name
}

module "cdn" {
  source         = "../modules/cdn"
  project_name   = var.project_name
  s3_origin_id   = var.project_name
  domain_name    = module.website.bucket.bucket_regional_domain_name
  index_document = var.index_document
}

module "website" {
  source                                    = "../modules/storage"
  project_name                              = var.project_name
  bucket_name                               = "foodbudget.co.nz"
  is_website                                = true
  cloudfront_origin_access_identity_iam_arn = [module.cdn.website_origin_access_identity.iam_arn]
  index_document                            = var.index_document
  error_document                            = var.error_document
}

# TODO: Maybe put this in module? Get this working for now...
# resource "aws_cloudwatch_event_rule" "run_every_saturday" {
#   name                = "every-saturday"
#   description         = "Fires every Saturday"
#   schedule_expression = "cron(0 0 * * SAT)"
# }

# resource "aws_cloudwatch_event_target" "run_every_saturday" {
#   rule      = aws_cloudwatch_event_rule.run_every_saturday.name
#   target_id = "lambda"
#   arn       = module.jobs.lambda.arn
# }

# Uncomment this when AWS Lambda supports Docker in Sydney
# module "jobs" {
#   source = "../modules/lambda"
#   file_name = "dist.zip"
#   function_name = "jobs"
#   handler_name = "index.handler"
# }
