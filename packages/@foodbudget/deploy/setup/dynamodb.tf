resource "aws_dynamodb_table" "foodbudget_terraform_state_lock" {
  name           = "foodbudget-terraform-state-lock-dynamo"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
