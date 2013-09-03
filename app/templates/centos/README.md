Vagrant/Puppet PHP 5.3
======================

PHP5.3 CentOS development server provisioned using Vagrant and Puppet. Puppet installs:

* PHP5.3 
 * PHP-FPM
 * XDebug on port 9000
 * Suhosin
 * MySQL PDO drivers
* MySQL 5.1
* Nginx
* Memcache

Requirements:
-------------

* A CentOS 6.x Vagrant box

How to use:
-----------

Install Virtualbox from [here](http://www.virtualbox.org/wiki/Downloads)

Intall the latest version of Vagrant from [here](http://downloads.vagrantup.com/)

Clone this repository with:

```shell
git clone https://github.com/partnermarketing/vagrant-php53.git
```

In the vagrant-php53 directory run:

```shell
vagrant up
```

and then put your code in the ```project``` directory and goto:

http://localhost:8080/ in a web browser
