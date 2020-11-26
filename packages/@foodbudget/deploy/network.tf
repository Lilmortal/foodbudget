resource "aws_vpc" "foodbudget_vpc" {
  cidr_block = var.vpc_cidr_block
  tags = {
    Name = format("%s-vpc", var.project)
  }
}

resource "aws_internet_gateway" "foodbudget_igw" {
  vpc_id = aws_vpc.foodbudget_vpc.id
  tags = {
    Name = format("%s-igw", var.project)
  }
}
