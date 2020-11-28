module "instance" {
  source = "../modules/instance"
  availability_zone      = module.network.availability_zone_a
  subnet_id              = module.network.public_subnet.id
  vpc_security_group_ids = [module.network.public_security_group.id]

  user_data_content = data.local_file.user_data.content
  project_name = var.project_name
}

module "network" {
  source = "../modules/network"
  project_name = var.project_name
}

module "storage" {
  source = "../modules/storage"
  project_name = var.project_name
}