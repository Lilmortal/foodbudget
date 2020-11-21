provider "aws" {
    region = "ap-southeast-2"
    access_key = var.aws_access_key
    secret_key = var.aws_secret_key
}

resource "aws_vpc" "default" {
    cidr_block = "10.0.0.0/16"
    tags = {
        Name = "Foodbudget VPC"
    }
}

// Internet gateway is to allow to send traffic out to the internet
resource "aws_internet_gateway" "this" {
    vpc_id = aws_vpc.default.id
    tags = {
         Name = "Foodbudget Internet Gateway"
    }
}