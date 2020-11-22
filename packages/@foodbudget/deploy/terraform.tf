terraform {
  required_version = "~> 0.12"
  # Setup backend for terraform, do not change it if you do know what it is.
  backend "s3" {
    bucket         = "foodbudget-terraform-remote-state-storage-s3bucket"
    dynamodb_table = "foodbudget-terraform-state-lock-dynamo"
    region         = "ap-southeast-2"
    key            = "foodbudget/terraform.tfstate"
  }
}
