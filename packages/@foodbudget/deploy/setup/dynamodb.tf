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

resource "aws_dynamodb_table" "foodbudget_terraform_db_state_lock" {
  name           = "foodbudget-terraform-db-state-lock-dynamo"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

resource "aws_iam_policy" "foodbudget_terraform_state_lock_policy" {
  name        = "foodbudget_terraform_state_lock_policy"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:PutItem",
                "dynamodb:CreateTableReplica",
                "dynamodb:UpdateItem",
                "dynamodb:UpdateTable"
            ],
            "Resource": [
              "arn:aws:dynamodb:ap-southeast-2:197204282783:table/foodbudget-terraform-state-lock-dynamo",
              "arn:aws:dynamodb:ap-southeast-2:197204282783:table/foodbudget-terraform-db-state-lock-dynamo"
            ],
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "222.153.187.129"
                }
            }
        }
    ]
}
EOF
}