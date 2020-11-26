resource "aws_iam_instance_profile" "backend_ec2_instance_profile" {
  name = format("%s-ec2-instance-profile", var.project)
  role = aws_iam_role.backend_ec2_instance_role.name
}

resource "aws_instance" "backend_ec2" {
  ami                    = var.backend_ec2_ami
  instance_type          = var.backend_ec2_instance_type
  availability_zone      = var.availability_zone_a
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.public.id]
  key_name               = format("%s-key", var.project)
  user_data              = data.local_file.user_data.content
  iam_instance_profile   = aws_iam_instance_profile.backend_ec2_instance_profile.name
  tags = {
    Name = format("%s-backend-ec2", var.project)
  }
}

resource "aws_eip" "api_eip" {
  instance = aws_instance.backend_ec2.id
  vpc      = true
}
