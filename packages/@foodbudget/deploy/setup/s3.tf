resource "aws_s3_bucket" "foodbudget_terraform_state_storage" {
  bucket = "foodbudget-terraform-remote-state-storage-s3bucket"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_policy" "foodbudget_terraform_state_storage_policy" {
  bucket = aws_s3_bucket.b.id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:ListBucketVersions",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::foodbudget-terraform-remote-state-storage-s3bucket",
                "arn:aws:s3:::foodbudget-terraform-remote-state-storage-s3bucket/foodbudget/foodbudget"
            ],
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "222.153.187.129"
                }
            }
        }
    ]
}
POLICY
}
