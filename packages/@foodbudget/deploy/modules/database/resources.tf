resource "aws_db_instance" "db_instance" {
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "postgres"
  engine_version         = "10.6"
  instance_class         = "db.t2.micro"
  name                   = "foodbudget"
  # TODO: Put this inside KMS
  username               = "useruser"
  password               = "passpass"
  # TODO: Change to false once we figured out how to connect to this...
  skip_final_snapshot = true
  vpc_security_group_ids = var.vpc_security_group_ids
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db_subnet_group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = format("%s-db-subnet-group", var.project_name)
  }
}
