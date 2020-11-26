terraform {
  required_version = "~> 0.12"
  # Set terraform state, do not change it if you do not know what it is.
  # Prevents state conflicts.
  backend "s3" {
    bucket         = "foodbudget-terraform-remote-state-storage-s3bucket"
    dynamodb_table = "foodbudget-terraform-state-lock-dynamo"
    region         = "ap-southeast-2"
    key            = "foodbudget/terraform.tfstate"
  }
}
