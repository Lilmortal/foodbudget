# resource "aws_instance" "jobs" {
#     ami = "ami-076e39b6b14e3bb20"
#     instance_type = "t2.micro"
#     availability_zone = "ap-southeast-2b"
#     subnet_id = aws_subnet.private.id
#     vpc_security_group_ids = [aws_security_group.private.id]
#     key_name = "foodbudget-key"

#     tags = {
#         Name = "api-server"
#     }
# }
