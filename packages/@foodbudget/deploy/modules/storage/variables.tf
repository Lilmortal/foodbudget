variable "project_name" {
  type = string
}

variable "bucket_name" {
  type = string
}

variable "cloudfront_origin_access_identity_iam_arn" {
  type    = list(string)
  default = []
}

variable "is_website" {
  type    = bool
  default = false
}

variable "index_document" {
  type = string
}

variable "error_document" {
  type = string
}
