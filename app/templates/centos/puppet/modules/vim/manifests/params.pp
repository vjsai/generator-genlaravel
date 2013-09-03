class vim::params {
  case $::osfamily {
    debian: {
      $package = 'vim-nox'
      $editor_name = 'vim.nox'
      $set_as_default = true
      $set_editor_cmd = "update-alternatives --set editor /usr/bin/${editor_name}"
      $test_editor_set = "test /etc/alternatives/editor -ef /usr/bin/${editor_name}"
	  $config_file = '/etc/vim/vimrc'
    }
	RedHat: {
	  $package = 'vim-enhanced'
      $set_as_default = false
	  $config_file = '/etc/vimrc'
	}
    default: {
      case $::operatingsystem {
        default: {
          fail("Unsupported platform: ${::osfamily}/${::operatingsystem}")
        }
      }
    }
  }
}
