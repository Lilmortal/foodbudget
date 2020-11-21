# resource "aws_db_instance" "api" {
#   allocated_storage    = 20
#   storage_type         = "gp2"
#   engine               = "postgres"
#   engine_version       = "10.6"
#   instance_class       = "db.t2.micro"
#   name                 = "foodbudget"
#   username             = "user"
#   password             = "pass"
# }