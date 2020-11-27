resource "aws_ecr_repository" "backend_ec2_repository" {
  name = "foodbudget-api"
}

resource "aws_ecr_repository" "backend_jobs_ec2_repository" {
  name = "foodbudget-jobs"
}
