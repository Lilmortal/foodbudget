# resource "aws_route53_record" "website-alias" {
#   zone_id = aws_route53_zone.primary.zone_id
#   name    = "www.foodbudget.co.nz"
#   type    = "A"
#   ttl     = "300"
#   records = [aws_eip.lb.public_ip]
# }
