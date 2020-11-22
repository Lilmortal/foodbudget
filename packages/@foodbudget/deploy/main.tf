provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_vpc" "foodbudget_vpc" {
  cidr_block = "10.10.0.0/16"
  tags = {
    Name = "foodbudget-vpc"
  }
}

// Internet gateway is to allow to send traffic out to the internet
resource "aws_internet_gateway" "foodbudget_igw" {
  vpc_id = aws_vpc.foodbudget_vpc.id
  tags = {
    Name = "foodbudget-igw"
  }
}
