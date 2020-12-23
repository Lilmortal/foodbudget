variable "vpc_cidr_block" {
  type = string
  default = "10.10.0.0/24"
}

variable "public_subnet_a_cidr_block" {
  type = string
  default = "10.10.0.0/26"
}

variable "public_subnet_b_cidr_block" {
  type = string
  default = "10.10.0.64/26"
}

variable "private_subnet_a_cidr_block" {
  type = string
  default = "10.10.0.128/26"
}

variable "private_subnet_b_cidr_block" {
  type = string
  default = "10.10.0.192/26"
}

variable "cidr_block_allow_all_ipv4" {
  type = string
  default = "0.0.0.0/0"
}

variable "cidr_block_allow_all_ipv6" {
  type = string
  default = "::/0"
}

variable "allow_any_protocol" {
  type = string
  default = "-1"
}

variable "subnet_a_availability_zone" {
  type = string
  default = "ap-southeast-2a"
}

variable "subnet_b_availability_zone" {
  type = string
  default = "ap-southeast-2b"
}

variable "project_name" {
  type = string
}
