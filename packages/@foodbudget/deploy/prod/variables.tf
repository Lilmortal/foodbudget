variable "project" {
  type = string
  default = "foodbudget"
}

variable "aws_region" {
  type = string
  default = "ap-southeast-2"
}

variable "availability_zone_a" {
  type = string
  default = "ap-southeast-2a"
}

variable "vpc_cidr_block" {
  type = string
  default = "10.10.0.0/16"
}

variable "public_subnet_cidr_block" {
  type = string
  default = "10.10.0.0/24"
}

variable "private_subnet_A_cidr_block" {
  type = string
  default = "10.10.0.0/18"
}

variable "private_subnet_B_cidr_block" {
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

variable "backend_ec2_ami" {
  type = string
  default = "ami-076e39b6b14e3bb20"
}

variable "backend_ec2_instance_type" {
  type = string
  default = "t2.micro"
}
