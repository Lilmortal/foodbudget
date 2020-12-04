variable "project_name" {
  type    = string
  default = "foodbudget-prod"
}

variable "aws_region" {
  type    = string
  default = "ap-southeast-2"
}

variable "jobs_storage_name" {
  type    = string
  default = "foodbudget-jobs-prod"
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}

variable "index_document" {
  type    = string
  default = "index.html"
}

variable "error_document" {
  type    = string
  default = "404.html"
}
