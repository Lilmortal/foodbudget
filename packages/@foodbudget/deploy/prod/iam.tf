resource "aws_iam_role" "backend_ec2_instance_role" {
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

resource "aws_iam_role_policy" "backend_ec2_policy" {
  name = format("%s-ec2-policy", var.project)
  role = aws_iam_role.backend_ec2_instance_role.id

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
        "arn:aws:ecr:ap-southeast-2:197204282783:repository/foodbudget-api",
        "arn:aws:ecr:ap-southeast-2:197204282783:repository/foodbudget-jobs"
      ]
    }
  ]
}
EOF
}
