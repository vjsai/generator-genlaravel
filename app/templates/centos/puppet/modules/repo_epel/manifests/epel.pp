# Extra Packages for Enterprise Linux (or EPEL) is a Fedora Special
# Interest Group that creates, maintains, and manages a high quality
# set of additional packages for Enterprise Linux, including, but
# not limited to, Red Hat Enterprise Linux (RHEL),CentOS and
# Scientific Linux (SL).
class repo_epel::epel inherits repo_epel::params {
  
  #file { "/etc/yum.repos.d/epel${::os_maj_version}.repo": ensure => absent, }
  
  package { "yum-plugin-priorities":
    ensure  => present,
  }
    
  yumrepo { 'epel':
    baseurl    => "absent",
	mirrorlist => "${url}?repo=epel-${urlbit}&arch=${::architecture}",
    descr      => "Extra Packages for Enterprise Linux (EPEL) Repository - EL${::os_maj_version} - ${::architecture}",
    enabled    => '1',
    gpgcheck   => '1',
    gpgkey     => "file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-${::os_maj_version}",
    priority   => '11',
	require    => Package['yum-plugin-priorities'],
  }

}