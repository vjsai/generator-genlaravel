# Class repo_epel
#
# Actions:
#   Configure the proper repositories and import GPG keys
#
# Reqiures:
#   CentOS 5 or 6
#
# Sample Usage:
#  include repo_epel
#
class repo_epel (
  $enable_testing = false,
) inherits repo_epel::params {

  if $::osfamily == 'RedHat' {
    include repo_epel::epel
    class { "repo_epel::testing":
      enable_testing   => $enable_testing,
    }

    repo_epel::rpm_gpg_key{ "RPM-GPG-KEY-EPEL-${::os_maj_version}":
      path => "/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-${::os_maj_version}",
    }

    file { "/etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-${::os_maj_version}":
      ensure => present,
      owner  => 0,
      group  => 0,
      mode   => '0644',
      source => "puppet:///modules/repo_epel/RPM-GPG-KEY-EPEL-${::os_maj_version}",
    }

  } else {
      notice ("Your operating system ${::operatingsystem} is not supported for EPEL repositories")
  }

}
