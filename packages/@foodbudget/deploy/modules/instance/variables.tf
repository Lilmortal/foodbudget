variable "ec2_ami" {
  type = string
  default = "ami-076e39b6b14e3bb20"
}

variable "ec2_instance_type" {
  type = string
  default = "t2.micro"
}

variable "project_name" {
  type = string
}

variable "availability_zone" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "vpc_security_group_ids" {
  type = list(string)
}

variable "user_data_content" {
  type = string
}