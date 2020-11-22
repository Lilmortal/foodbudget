terraform {
  required_version = "~> 0.12"
  # Setup backend for terraform, do not change it if you do know what it is.
  backend "s3" {
    encrypt        = true
    bucket         = "zone-d-nonprod-terraform-remote-state-storage-s3bucket"
    dynamodb_table = "zone-d-nonprod-terraform-state-lock-dynamo"
    region         = "ap-southeast-2"
    key            = "tf-wiremock-ec2/terraform.tfstate"
  }
}
