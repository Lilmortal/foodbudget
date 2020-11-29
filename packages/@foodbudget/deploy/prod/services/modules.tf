module "instance" {
  source = "../../modules/instance"
  availability_zone      = module.network.availability_zone_a
  subnet_id              = module.network.public_subnet.id
  vpc_security_group_ids = [module.network.public_security_group.id]
  project_name = var.project_name
}

module "network" {
  source = "../../modules/network"
  project_name = var.project_name
}
