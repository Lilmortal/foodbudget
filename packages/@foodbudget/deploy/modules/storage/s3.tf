resource "aws_s3_bucket" "bucket" {
  bucket        = var.bucket_name
  acl           = "private"
  force_destroy = true

  website {
    index_document = var.index_document
    error_document = var.error_document
  }

  versioning {
    enabled = true
  }

  tags = {
    Name = format("%s-bucket", var.project_name)
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  count  = var.is_website ? 1 : 0
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.bucket_iam_policy.json
}

data "aws_iam_policy_document" "bucket_iam_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = var.cloudfront_origin_access_identity_iam_arn
    }
  }
}
