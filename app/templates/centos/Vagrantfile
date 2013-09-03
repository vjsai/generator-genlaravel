# -*- mode: ruby -*-
# vi: set ft=ruby :
# Partnermarketing.com Vagrant sandbox (PHP 5.3)

Vagrant.configure("2") do |config|

  config.vm.hostname = "partnermarketing-php53"

  # The base Vagrant/VirtualBox box
  config.vm.box = "centos-6.3-chef-10.14.2"

  # The url for the base Vagrant box
  config.vm.box_url = "https://s3.amazonaws.com/itmat-public/centos-6.3-chef-10.14.2.box"

  # Boot with a GUI so you can see the screen. (Default is headless)
  #config.vm.boot_mode = :gui

  # Boot with a GUI so you can see the screen. (Default is headless)
  # config.vm.boot_mode = :gui

  config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.network :private_network, ip: "192.168.50.4"
  
  # Someone's a bit slow at booting
  config.ssh.max_tries = 50
  config.ssh.timeout = 300

  config.vm.synced_folder "./project", "/web", :nfs => true

  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "puppet/manifests"
    puppet.module_path    = 'puppet/modules'
    puppet.options = ['--verbose']
  end
end