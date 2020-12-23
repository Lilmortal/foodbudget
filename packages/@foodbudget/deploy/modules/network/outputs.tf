output "private_subnet_a" {
    value = aws_subnet.private_a
}

output "private_subnet_b" {
    value = aws_subnet.private_b
}

output "public_subnet_a" {
    value = aws_subnet.public_a
}

output "public_subnet_b" {
    value = aws_subnet.public_b
}

output "instance_security_group" {
    value = aws_security_group.instance
}

output "db_security_group" {
    value = aws_security_group.db
}

output "availability_zone_a" {
    value = var.subnet_a_availability_zone
}

output "vpc" {
    value = aws_vpc.vpc
}
