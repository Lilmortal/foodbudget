output "public_subnet" {
    value = aws_subnet.public
}

output "public_security_group" {
    value = aws_security_group.public
}

output "availability_zone_a" {
    value = var.subnet_a_availability_zone
}