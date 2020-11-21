// Route table dictates how subnets can talk to different IP addresses. If you want to expose a subnet to the internet, point
// that subnet to the internet gateway, which will be the proxy point handling both internal and external traffic.
resource "aws_route_table" "public" {
    vpc_id = aws_vpc.default.id

    route {
        // 10.0.1.0/24 send to internet gateway
        // 0.0.0.0/0 send all Ipv4 traffic
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.this.id
    }

    route {
        ipv6_cidr_block = "::/0"
        gateway_id = aws_internet_gateway.this.id
    }

    tags = {
        Name = "Foodbudget Route Table"
    }
}

// A portion of VPC with its own CIDR blocks.
resource "aws_subnet" "public" {
    vpc_id = aws_vpc.default.id
    cidr_block = "10.0.6.0/24"
    availability_zone = "ap-southeast-2a"

    tags = {
        Name = "Foodbudget subnet A"
    }
}

resource "aws_subnet" "public-B" {
    vpc_id = aws_vpc.default.id
    cidr_block = "10.0.24.0/24"
    availability_zone = "ap-southeast-2b"

    tags = {
        Name = "Foodbudget subnet B"
    }
}

// Link subnet to route table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

// Security group handles incoming (ingress) and outcoming (egress) traffic from/to EC2 instances, whereas
// internet gateway and NAT are mainly for the subnets.
resource "aws_security_group" "public" {
  name        = "allow_web_trafic"
  vpc_id      = aws_vpc.default.id

  ingress {
    description = "Accept all HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Accept all HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    // -1 means any protocol
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_web"
  }
}