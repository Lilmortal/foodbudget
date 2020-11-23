# resource "aws_route_table" "private" {
#     vpc_id = aws_vpc.this.id

#     tags = {
#         Name = "Foodbudget Private Route Table"
#     }
# }


# resource "aws_subnet" "private" {
#     vpc_id = aws_vpc.this.id
#     cidr_block = "10.0.1.0/24"
#     availability_zone = "ap-southeast-2b"

#     tags = {
#         Name = "Foodbudget subnet B"
#     }
# }

# resource "aws_route_table_association" "private" {
#   subnet_id      = aws_subnet.private.id
#   route_table_id = aws_route_table.private.id
# }

# resource "aws_security_group" "private" {
#   name        = "disallow_web_trafic"
#   vpc_id      = aws_vpc.this.id

#   egress {
#     from_port   = 0
#     to_port     = 0
#     // -1 means any protocol
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = {
#     Name = "disallow_web"
#   }
# }
