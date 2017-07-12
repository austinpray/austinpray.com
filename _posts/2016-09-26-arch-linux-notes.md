Just some notes from installing Arch Linux. Will come back and clean this article up.

## Don't Forget

Install and enable NTPD https://wiki.archlinux.org/index.php/Network_Time_Protocol_daemon

## GUI and Graphics

Nvidia GTX 1070 -> install `nvidia` package. `nvidia-libgl` fine.

`lightdm` + `i3` + `termite`

Replace dmenu with https://github.com/enkore/j4-dmenu-desktop <-- sooo dope

## Japanese Fonts

Don't forget your Japanese fonts if you are an insufferable weeb. 

`sudo pacman -S adobe-source-han-sans-jp-fonts`
`sudo pacman -S otf-ipafont`

## Virtualbox and Vagrant

https://wiki.archlinux.org/index.php/VirtualBox#Installation_steps_for_Arch_Linux_hosts
https://wiki.archlinux.org/index.php/Vagrant

`pacman -S virtualbox vagrant` and then choose `virtualbox-host-modules-arch`.

You are gonna probably need nfs https://wiki.archlinux.org/index.php/NFS

I had to install `net-tools` to get nfs working.

## Installed Packages List

Packages list last updated: 2017-07-12

```arch-packages
adobe-source-han-sans-jp-fonts
alsa-utils
anki
apvlv
arandr
autoconf
autojump
automake
avidemux-qt
baobab
bash
bind-tools
binutils
bison
brother-brgenml1
btrfs-progs
bzip2
chromium
coreutils
cower
cryptsetup
cuda
cudnn
cups-pdf
device-mapper
dhcpcd
diffutils
dmenu
docker
docker-compose
dosfstools
e2fsprogs
emojione-color-font
escrotum-git
fakeroot
fbida
fbv
ffmpeg
file
filesystem
findutils
flashplayer-standalone
flex
foomatic-db-engine
foomatic-db-nonfree-ppds
foomatic-db-ppds
foxitreader
gawk
gcc
gcc-libs
gettext
gimp
git
git-lfs
glibc
gnome-system-monitor
google-chrome
gparted
gradle
graphviz
grep
gvim
gzip
highlight
htop
i3-wm
i3lock
i3status
ibus
ibus-mozc
imlib2
inetutils
inkscape
iproute2
iputils
j4-dmenu-desktop
jdk8-openjdk
jetbrains-toolbox
jfsutils
jq
kakasi
kanjistrokeorders-ttf
keepass
keychain
klavaro
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
lxc
m4
make
man-db
man-pages
mariadb-clients
mdadm
mecab-ipadic
meh-git
meld
mplayer
mupdf
mysql-workbench
nano
net-tools
netctl
nfs-utils
ntfs-3g
nvidia
openssh
otf-ipafont
p7zip
pacaur
pacman
patch
pavucontrol
pciutils
pcmciautils
perl
pkg-config
poppler
postgresql
procps-ng
psmisc
pulseaudio
pulseaudio-alsa
pwgen
python-beautifulsoup4
python-cairo
python-gobject
python-pip
python-protobuf
python-tensorflow
python2-virtualenv
qt4
ranger
redshift
reiserfsprogs
rsync
rxvt
rxvt-unicode
s-nail
sbt
scala
sed
shadow
silver-searcher-git
slack-desktop
sshfs
sudo
sux
sysfsutils
system-config-printer
systemd-sysvcompat
tar
termite
texinfo
tidy
tree
ttf-google-fonts-git
ttf-ms-win10
ttf-ms-win10-japanese
ttf-ms-win10-korean
ttf-ms-win10-other
ttf-ms-win10-sea
ttf-ms-win10-thai
ttf-ms-win10-zh_cn
ttf-ms-win10-zh_tw
tuxboot
unzip
usbutils
util-linux
vagrant
vi
virtualbox
virtualbox-ext-oracle
vlc
w3m
wget
which
winusb
wrk
xautolock
xclip
xfsprogs
zathura
zip
zsh
```
