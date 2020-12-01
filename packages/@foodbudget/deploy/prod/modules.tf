module "instance" {
  source = "../modules/instance"
  availability_zone      = module.network.availability_zone_a
  subnet_id              = module.network.public_subnet_a.id
  vpc_security_group_ids = [module.network.instance_security_group.id]
  project_name = var.project_name
}

module "storage" {
  source = "../modules/storage"
  project_name = var.project_name
  subnet_ids = [module.network.private_subnet_a.id, module.network.private_subnet_b.id]
  vpc_security_group_ids = [module.network.db_security_group.id]
}

module "network" {
  source = "../modules/network"
  project_name = var.project_name
}

module "website" {
  source = "../modules/website"
  project_name = var.project_name
  bucket_name = "foodbudget.co.nz"
}