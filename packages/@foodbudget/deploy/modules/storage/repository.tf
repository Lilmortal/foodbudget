resource "aws_ecr_repository" "api_repository" {
  name = format("%s-api", var.project_name)
}

# TODO: Move jobs logic to Lambda and Cloudwatch Rule
resource "aws_ecr_repository" "jobs_repository" {
  name = format("%s-jobs", var.project_name)
}
