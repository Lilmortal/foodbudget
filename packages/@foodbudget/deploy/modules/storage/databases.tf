# resource "aws_db_instance" "backend_db_instance" {
#   allocated_storage      = 20
#   storage_type           = "gp2"
#   engine                 = "postgres"
#   engine_version         = "10.6"
#   instance_class         = "db.t2.micro"
#   name                   = "foodbudget"
#   username               = "user"
#   password               = "passpass"
#   vpc_security_group_ids = [aws_security_group.private.id]
#   db_subnet_group_name   = aws_db_subnet_group.backend_db_subnet_group.name
# }

# resource "aws_db_subnet_group" "backend_db_subnet_group" {
#   name       = "backend_db_subnet_group"
#   subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

#   tags = {
#     Name = "DB subnet group"
#   }
# }
