resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.private_subnet_a_cidr_block
  availability_zone = var.subnet_a_availability_zone

  tags = {
    Name = format("%s-private-subnet-a", var.project_name)
  }
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.private_subnet_b_cidr_block
  availability_zone = var.subnet_b_availability_zone

  tags = {
    Name = format("%s-private-subnet-b", var.project_name)
  }
}

resource "aws_security_group" "db" {
  name   = format("%s-db-sg", var.project_name)
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

  tags = {
    Name = format("%s-db-sg", var.project_name)
  }
}
