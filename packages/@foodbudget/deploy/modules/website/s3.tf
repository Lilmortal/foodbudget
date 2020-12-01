resource "aws_s3_bucket" "website" {
  bucket = var.bucket_name
  acl    = "private"
  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  versioning {
    enabled = true
  }
  
  tags = {
    Name = format("%s-website", var.project_name)
  }
}

locals {
  # No idea what's a good origin ID
  s3_origin_id = var.project_name
}

resource "aws_s3_bucket_policy" "website_bucket_policy" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.website_policy.json
}

data "aws_iam_policy_document" "website_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.website_origin_access_identity.iam_arn]
    }
  }
}