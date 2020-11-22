resource "aws_instance" "backend_ec2" {
  ami                    = "ami-076e39b6b14e3bb20"
  instance_type          = "t2.micro"
  availability_zone      = "ap-southeast-2a"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.public.id]
  key_name               = "foodbudget-key"
  user_data              = data.local_file.user_data.content
  tags = {
    Name = "foodbudget-backend-ec2"
  }
}

// Attach an EIP to the API instance, this allows the internet to access
// its public IPv4 address
resource "aws_eip" "api_eip" {
  instance = aws_instance.backend_ec2.id
  vpc      = true
}
