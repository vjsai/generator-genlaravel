
#
# Install nginx and setup basic vhost for symfony2
#
class setup_nginx {

    #
    # Lets the Debian style sites-enabled and sites-available dirs!
    #
    
    file { "/etc/nginx/sites-enabled/":
	  ensure  => directory,
	  path    => "/etc/nginx/sites-enabled/",
	  owner   => "root",
	  group   => "root",
	  mode    => "0664",
	  require => Package["nginx"],
    }

    file { "/etc/nginx/sites-available/":
	  ensure  => directory,
	  path    => "/etc/nginx/sites-available/",
	  owner   => "root",
	  group   => "root",
	  mode    => "0664",
	  require => Package["nginx"],
    }

    include nginx

	file { "nginx_symfony2.conf":
		owner  => root,
		group  => root,
		mode   => 664,
		source => "/vagrant/conf/nginx/symfony2.conf",
		path   => "/etc/nginx/sites-available/symfony2.conf",
		require => Package['nginx'],
	}

	file { "/etc/nginx/sites-enabled/symfony2.conf":
		owner  => root,
		group  => root,
		mode   => 664,
		ensure => link,
		target => "/etc/nginx/sites-available/symfony2.conf",
		require => Package['nginx'],
		notify => Service['nginx'],
	}

}

#
# Install php and some required modules
#
class setup_php_centos {

	require repo_epel

	include php::fpm

	php::module { [
        'gd', 'mcrypt', 'pecl-memcached', 'mysql',
        'tidy', 'pecl-xhprof','xml',
        ]:
        notify => Class['php::fpm::service'],
    }

    php::module { [ 'pecl-xdebug', ]:
        notify  => Class['php::fpm::service'],
        source => "/vagrant/conf/php/xdebug.ini",
    }

    php::module { [ 'suhosin', ]:
        notify  => Class['php::fpm::service'],
        source => "/vagrant/conf/php/suhosin.ini",
    }

    php::module { [ 'pdo' ]:
        notify  => Class['php::fpm::service'],
    }

    file { "/etc/php.d/custom.ini":
        owner  => root,
        group  => root,
        mode   => 664,
        source => "/vagrant/conf/php/custom.ini",
        notify => Class['php::fpm::service'],
    }

    file { "/etc/php-fpm.d/symfony2.conf":
        owner  => root,
        group  => root,
        mode   => 664,
        source => "/vagrant/conf/php/php-fpm/php-fpm.conf",
        notify => Class['php::fpm::service'],
    }
}

class symfony2_centos {

	exec { 'php-composer':
        command => '/usr/bin/curl -s https://getcomposer.org/installer | /usr/bin/php',
        unless => "/usr/bin/test -e /usr/local/bin/composer",
		cwd => "/tmp",
        require => Class['php::install'],
    }

	file { "/usr/local/bin/composer.phar":
        owner   => root,
        group   => root,
        mode    => 755,
        source  => "/tmp/composer.phar",
		require => Exec["php-composer"],
        notify  => Class['php::fpm::service'],
    }

	file { "/vagrant/project":
        owner   => nginx,
        group   => nginx,
		ensure  => directory,
        mode    => 664,
		require => Package['nginx'],
        notify  => [
			Class['php::fpm::service'],
			Service['nginx']
		],
    }

}

class nginx_setup_test {

    #
    # Add our nginx.conf file
    #
    file { '/etc/nginx/nginx.conf':
        source  => "/vagrant/puppet/modules/nginx/nginx.conf",
        force   => "true",
        require => Package['nginx'],
        notify  => Service['nginx'],
    }

}



class {'vim':}

class {'repo_epel':}

iptables::allow { 'tcp/80': port => '80', protocol => 'tcp' }

include mysql::server

mysql::db { "symfony2": source => "/vagrant/conf/mysql/symfony2.sql" }

mysql::grant { "Symfony2_User": user => "symfony2", password => "password", db => "symfony2" }

class { 'memcached':
	max_memory => 65536
}

include setup_nginx
include setup_php_centos
include symfony2_centos
include nginx_setup_test