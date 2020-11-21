# resource "aws_instance" "api" {
#     ami = "ami-076e39b6b14e3bb20"
#     instance_type = "t2.micro"
#     availability_zone = "ap-southeast-2a"
#     subnet_id = aws_subnet.public.id
#     vpc_security_group_ids = [aws_security_group.public.id]
#     key_name = "foodbudget-key"

#     tags = {
#         Name = "api-server"
#     }
# }

// Attach an EIP to the API instance, this allows the internet to access
// its public IPv4 address
# resource "aws_eip" "api_eip" {
#   instance = aws_instance.api.id
#   vpc      = true
# }

resource "aws_ecr_repository" "api_repository" {
  name                 = "foodbudget_api"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecs_cluster" "api-cluster" {
  name = "Foodbudget_API_Cluster"
}

resource "aws_ecs_task_definition" "api" {
  family                = "api"
  container_definitions =   <<DEFINITION
  [
    {
      "name": "api",
      "image": "197204282783.dkr.ecr.ap-southeast-2.amazonaws.com/foodbudget_api:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080y
        }
      ]
    }
  ]
  DEFINITION
  memory = 512
  cpu = 256
  network_mode = "awsvpc"
}

# resource "aws_iam_role" "ecsTaskExecutionRole" {
#   name               = "ecsTaskExecutionRole"
#   assume_role_policy = "${data.aws_iam_policy_document.assume_role_policy.json}"
# }

# data "aws_iam_policy_document" "assume_role_policy" {
#   statement {
#     actions = ["sts:AssumeRole"]

#     principals {
#       type        = "Service"
#       identifiers = ["ecs-tasks.amazonaws.com"]
#     }
#   }
# }

resource "aws_lb" "foodbudget-lb" {
  name               = "foodbudget-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.public.id]
  subnets            = [aws_subnet.public.id, aws_subnet.public-B.id]

  enable_deletion_protection = true

  # access_logs {
  #   bucket  = aws_s3_bucket.lb_logs.bucket
  #   prefix  = "test-lb"
  #   enabled = true
  # }

  tags = {
    Environment = "production"
  }
}

resource "aws_lb_target_group" "api-target-group" {
  # depends_on = [
  #   "aws_lb.foodbudget-lb"
  # ]
  name     = "api-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.default.id
  target_type = "ip"
}

resource "aws_ecs_service" "api" {
  depends_on = [
    aws_lb.foodbudget-lb
  ]
  name            = "api"
  cluster         = aws_ecs_cluster.api-cluster.id
  task_definition = aws_ecs_task_definition.api.arn
  // Keeping it 1 for now, I don't really need a load balancer as of yet.
  // I don't need 99.9999999999 uptime.
  desired_count   = 1

  network_configuration {
    subnets = [aws_subnet.public.id, aws_subnet.public-B.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api-target-group.arn
    container_name   = aws_ecs_task_definition.api.family
    container_port   = 8080
  }
}