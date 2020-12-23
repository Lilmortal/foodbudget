resource "aws_iam_role" "lambda_role" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "lambda" {
  filename      = var.file_name
  function_name = var.function_name
  role          = aws_iam_role.lambda_role.arn
  handler       = var.handler_name

  source_code_hash = filebase64sha256(var.file_name)

  runtime = "nodejs12.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
}