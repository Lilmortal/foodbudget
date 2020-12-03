variable "project_name" {
  type = string
}

variable "vpc_security_group_ids" {
  type = list(string)
}

variable "subnet_ids" {
  type = list(string)
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}
