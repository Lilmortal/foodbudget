resource "aws_s3_bucket" "foodbudget_terraform_stage_storage" {
  bucket = "foodbudget-terraform-remote-state-storage-s3bucket"

  tags = {
    Name = "TerraformStateStorage"
  }
}
