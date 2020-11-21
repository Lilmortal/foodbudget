resource "aws_instance" "api" {
    ami = "ami-076e39b6b14e3bb20"
    instance_type = "t2.micro"
    availability_zone = "ap-southeast-2a"
    subnet_id = aws_subnet.public.id
    vpc_security_group_ids = [aws_security_group.public.id]
    key_name = "foodbudget-key"
    user_data = <<EOF
      #! /bin/bash
      sudo yum install docker
      sudo service docker start
      aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com
      sudo usermod -aG docker ec2-user
      docker pull 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-repository:latest
      docker run -p 8080:8080 197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget-repository:latest
    EOF

    tags = {
        Name = "api-server"
    }
}

// Attach an EIP to the API instance, this allows the internet to access
// its public IPv4 address
resource "aws_eip" "api_eip" {
  instance = aws_instance.api.id
  vpc      = true
}