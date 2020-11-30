resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = format("%s-ec2-instance-profile", var.project_name)
  role = aws_iam_role.ec2_instance_role.name
}

resource "aws_instance" "ec2" {
  ami                    = var.ec2_ami
  instance_type          = var.ec2_instance_type
  availability_zone      = var.availability_zone
  subnet_id              = var.subnet_id
  vpc_security_group_ids = var.vpc_security_group_ids
  key_name               = format("%s-key", var.project_name)
  user_data              = data.local_file.user_data.content
  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name
  tags = {
    Name = format("%s-backend-ec2", var.project_name)
  }
}

resource "aws_eip" "ec2_eip" {
  instance = aws_instance.ec2.id
  vpc      = true
}

resource "aws_iam_role" "ec2_instance_role" {
  name = "ec2-instance-role"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = format("%s-ec2-policy", var.project_name)
  role = aws_iam_role.ec2_instance_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:ecr:ap-southeast-2:197204282783:repository/foodbudget-prod-api",
        "arn:aws:ecr:ap-southeast-2:197204282783:repository/foodbudget-prod-jobs"
      ]
    }
  ]
}
EOF
}
