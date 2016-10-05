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

Packages list last updated: 2016-10-05

```arch-packages
adobe-source-code-pro-fonts
adobe-source-han-sans-jp-fonts
alsa-utils
autoconf
autojump
automake
bash
binutils
bison
bzip2
coreutils
cower
cryptsetup
device-mapper
dhcpcd
diffutils
dmenu
e2fsprogs
emojione-color-font
escrotum-git
fakeroot
file
filesystem
findutils
flex
gawk
gcc
gcc-libs
gettext
git
glibc
google-chrome
gradle
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
nano
net-tools
netctl
nfs-utils
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
procps-ng
psmisc
pulseaudio
pulseaudio-alsa
python-pip
python2-virtualenv
ranger
reiserfsprogs
s-nail
sed
shadow
slack-desktop
sudo
sysfsutils
systemd-sysvcompat
tar
termite
texinfo
tree
unzip
usbutils
util-linux
vagrant
vi
virtualbox
w3m
wget
which
xautolock
xclip
xfsprogs
zip
zsh
```
