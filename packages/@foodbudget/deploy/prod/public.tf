resource "aws_route_table" "public" {
  vpc_id = aws_vpc.foodbudget_vpc.id

  route {
    cidr_block = var.cidr_block_allow_all_ipv4
    gateway_id = aws_internet_gateway.foodbudget_igw.id
  }

  route {
    ipv6_cidr_block = var.cidr_block_allow_all_ipv6
    gateway_id      = aws_internet_gateway.foodbudget_igw.id
  }

  tags = {
    Name = format("%s-public-rt", var.project)
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.foodbudget_vpc.id
  cidr_block        = var.public_subnet_cidr_block
  availability_zone = var.availability_zone_a

  tags = {
    Name = "PublicSubnetA"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "public" {
  name   = format("%s-ec2-sg", var.project)
  vpc_id = aws_vpc.foodbudget_vpc.id

  ingress {
    description = "Default foodbudget API port 8080"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [
      var.cidr_block_allow_all_ipv4
    ]
  }

  ingress {
    description = "SSH access for all"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [
      # TODO: Whitelist to a specific IP Address
      var.cidr_block_allow_all_ipv4
    ]
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = [
      var.cidr_block_allow_all_ipv4
    ]
  }

  tags = {
    Name = format("%s-ec2-sg", var.project)
  }
}
