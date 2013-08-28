class php 
{

    $packages = [
        "php5", 
        "php5-cli", 
        "php5-mysql", 
        "php-pear", 
        "php5-dev", 
        "libapache2-mod-php5",
        "php5-xdebug",
        "php5-mcrypt"
    ]
    
    package 
    { 
        $packages:
            ensure  => latest,
            require => [Exec['apt-get update'], Package['python-software-properties']]
    }
  
}
