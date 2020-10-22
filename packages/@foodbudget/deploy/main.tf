provider "aws" {
    region = "ap-southeast-2"
}

resource "aws_instance" "api" {
    ami = "ami-0f96495a064477ffb"
    instance_type = "t2.micro"

    tags = {
        Name = "Api"
    }
}