data "local_file" "user_data" {
  filename = "${path.module}/userdata.sh"
}