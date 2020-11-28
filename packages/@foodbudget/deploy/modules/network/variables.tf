variable "vpc_cidr_block" {
  type = string
  default = "10.10.0.0/16"
}

variable "public_subnet_cidr_block" {
  type = string
  default = "10.10.0.0/24"
}

variable "private_subnet_a_cidr_block" {
  type = string
  default = "10.10.0.0/18"
}

variable "private_subnet_b_cidr_block" {
  type = string
  default = "10.10.0.0/16"
}

variable "cidr_block_allow_all_ipv4" {
  type = string
  default = "0.0.0.0/0"
}

variable "cidr_block_allow_all_ipv6" {
  type = string
  default = "::/0"
}

variable "subnet_a_availability_zone" {
  type = string
  default = "ap-southeast-2a"
}

variable "project_name" {
  type = string
}