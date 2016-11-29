Just some notes from installing Arch Linux. Will come back and clean this article up.

## Don't Forget

Install and enable NTPD https://wiki.archlinux.org/index.php/Network_Time_Protocol_daemon

## GUI and Graphics

Nvidia GTX 1070 -> install `nvidia` package. `nvidia-libgl` fine.

`lightdm` + `i3` + `termite`

Replace dmenu with https://github.com/enkore/j4-dmenu-desktop <-- sooo dope

## Japanese Fonts

Don't forget your Japanese fonts if you are listening to future funk. 

`sudo pacman -S adobe-source-han-sans-jp-fonts`
`sudo pacman -S otf-ipafont`

## Virtualbox and Vagrant

https://wiki.archlinux.org/index.php/VirtualBox#Installation_steps_for_Arch_Linux_hosts
https://wiki.archlinux.org/index.php/Vagrant

`pacman -S virtualbox vagrant` and then choose `virtualbox-host-modules-arch`.

You are gonna probably need nfs https://wiki.archlinux.org/index.php/NFS

I had to install `net-tools` to get nfs working.

## Installed Packages List

Packages list last updated: 2016-11-28

```arch-packages
adobe-source-code-pro-fonts
adobe-source-han-sans-jp-fonts
alsa-utils
autoconf
autojump
automake
avidemux-qt
bash
binutils
bison
brother-brgenml1
bzip2
coreutils
cower
cryptsetup
cups-pdf
device-mapper
dhcpcd
diffutils
dmenu
e2fsprogs
emojione-color-font
escrotum-git
fakeroot
ffmpeg
file
filesystem
findutils
flex
foomatic-db-engine
foomatic-db-nonfree-ppds
foomatic-db-ppds
gawk
gcc
gcc-libs
gettext
git
glibc
google-chrome
gparted
gradle
graphviz
grep
gvim
gzip
highlight
i3-wm
i3lock
i3status
imlib2
inetutils
iproute2
iputils
j4-dmenu-desktop
jdk8-openjdk
jfsutils
keepass
keychain
less
libmcrypt
libreoffice-fresh
libtool
licenses
lightdm
lightdm-gtk-greeter
linux
logrotate
lvm2
m4
make
man-db
man-pages
mdadm
meld
nano
net-tools
netctl
nfs-utils
ntfs-3g
nvidia
openssh
otf-ipafont
pacaur
pacman
patch
pavucontrol
pciutils
pcmciautils
perl
pkg-config
pm-utils
poppler
postgresql
procps-ng
psmisc
pulseaudio
pulseaudio-alsa
python-gobject
python-pip
python2-virtualenv
qt4
ranger
redshift
reiserfsprogs
rsync
s-nail
sbt
scala
sed
shadow
slack-desktop
sshfs
sudo
sysfsutils
systemd-sysvcompat
tar
termite
texinfo
tidy
tree
unzip
usbutils
util-linux
vagrant
vi
virtualbox
vlc
w3m
wget
which
xautolock
xclip
xfsprogs
zip
zsh
```
