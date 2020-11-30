resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = var.cidr_block_allow_all_ipv4
    gateway_id = aws_internet_gateway.igw.id
  }

  route {
    ipv6_cidr_block = var.cidr_block_allow_all_ipv6
    gateway_id      = aws_internet_gateway.igw.id
  }

  tags = {
    Name = format("%s-public-rt", var.project_name)
  }
}

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_a_cidr_block
  availability_zone = var.subnet_a_availability_zone

  tags = {
    Name = "public_subnet_a"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.public_subnet_b_cidr_block
  availability_zone = var.subnet_b_availability_zone

  tags = {
    Name = "public_subnet_b"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "instance" {
  name   = format("%s-instance-sg", var.project_name)
  vpc_id = aws_vpc.vpc.id

  ingress {
    # TODO: Put this as an input variable
    description = "Default API port 8080"
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
    protocol  = var.allow_any_protocol
    cidr_blocks = [
      var.cidr_block_allow_all_ipv4
    ]
  }

  tags = {
    Name = format("%s-instance-sg", var.project_name)
  }
}
