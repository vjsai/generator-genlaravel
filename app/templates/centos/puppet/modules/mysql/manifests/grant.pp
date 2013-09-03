# Creates a new user with access to a certain database, or gives permission
# to an existing user to access a certain database.
#
# == Parameters
# 
# [*user*]
#   The name of the user to give access to (or the new user to be created)
#
# [*password*]
#   The password for the new user
#
# [*db*]
#   The name of the database to give access to
#
# [*host*]
#   The host from where the user is allowed to connect
#
# == Examples
#
# Invoke with the name and source for the new db, as in:
#   mysql::grant { "MyService_MyDb_MyUser": user => "MyUser", password => "MyPass, db => "MyDb" }
#
# == Authors
#
# CERN IT/GT/DMS <it-dep-gt-dms@cern.ch>
#
define mysql::grant($user, $password, $db, $host="localhost") {
  exec { "mysql_user_grant_$user_$db":
    path    => "/usr/bin:/usr/sbin:/bin",
    command => "mysql -uroot -e \"grant all privileges on $db.* to '$user'@'$host' identified by '$password'\"",
    unless  => "mysql -u$user -p$password -D$db -h$host",
    require => Service['mysqld'],
  }
}
