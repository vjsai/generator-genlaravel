# Sets up a MySQL server instance (configuration plus service daemon).
# 
# == Examples
#
# Simply include the class, as in:
#   include mysql::server
#
# == Authors
#
# CERN IT/GT/DMS <it-dep-gt-dms@cern.ch>
#
class mysql::server {
  package { ["mysql", "mysql-server"]: ensure => latest }

  service { "mysqld":
    ensure     => running,
    enable     => true,
    hasrestart => true,
    hasstatus  => true,
    require    => Package['mysql-server', 'mysql'],
  }
}
