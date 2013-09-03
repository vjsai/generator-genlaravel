# Extra Packages for Enterprise Linux (or EPEL) is a Fedora Special
# Interest Group that creates, maintains, and manages a high quality
# set of additional packages for Enterprise Linux, including, but
# not limited to, Red Hat Enterprise Linux (RHEL),CentOS and
# Scientific Linux (SL).
# epel-testing is for packages not yet deemed stable
class repo_epel::testing  (
  $enable_testing = false,
) inherits repo_epel::params {

  if $enable_testing {
    $enabled = 1
  } else {
    $enabled = 0
  }
  
  yumrepo { 'epel-testing':
    baseurl  => "${url}/${urlbit}/${::architecture}",
    descr    => "Extra Packages for Enterprise Linux (EPEL) Testing Repository - EL${::os_maj_version} - ${::architecture}",
    enabled  => "${enabled}",
    gpgcheck => '1',
    gpgkey   => "file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-${::os_maj_version}",
    priority => '11',
  }

}