# Defines a new MySQL database on the local server.
#
# == Parameters
# 
# [*name*]
#   The name of the new database
#
# [*source*]
#   The location of the file containing the SQL source to create the db entities
#
# == Examples
#
# Invoke with the name and source for the new db, as in:
#   mysql::db { "NewDbName": source => "/path/to/the/source.sql" }
#
# == Authors
#
# CERN IT/GT/DMS <it-dep-gt-dms@cern.ch>
#
define mysql::db($source) {
  exec { "mysql_schema_load_$name":
    path    => "/usr/bin:/usr/sbin:/bin",
    command => "mysql -uroot < $source",
    unless  => "mysql -uroot -e \"use $name\"",
    require => Service['mysqld'],
  }   
}
