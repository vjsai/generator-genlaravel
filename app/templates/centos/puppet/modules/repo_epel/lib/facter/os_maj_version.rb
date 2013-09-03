# This is a simple fact to get the Major version of an OS without having to
# have the entire LSB suite installed.  LSB seems to pull in about 300 megs of
# stuff I often don't require. This fact is quick to load so it shouldn't be
# much of an issue.
#
# https://puppetlabs.com/blog/facter-part-1-facter-101/
# https://puppetlabs.com/blog/facter-part-2-testing-and-deployment/
# $ mkdir -p ~/lib/facter
# $ cp modules/repo_centos/lib/facter/*.rb ~/lib/facter/
# $ export FACTERLIB=~/lib/facter:$FACTERLIB
# $ facter | grep os_maj_version

Facter.add(:os_maj_version) do
  v = Facter.value(:operatingsystemrelease)
  setcode do
    v.split('.')[0].strip
  end
end
