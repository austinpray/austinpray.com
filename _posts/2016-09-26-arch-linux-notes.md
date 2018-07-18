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

Packages list last updated: 2018-07-18

```arch-packages
adobe-source-han-sans-jp-fonts
alsa-utils
anki
apvlv
arandr
at
autoconf
autojump
automake
avidemux-qt
aws-cli
baka-mplayer
baobab
bash
beep
bind-tools
binutils
bison
brother-brgenml1
btrfs-progs
bzip2
certbot
chromium
cli-visualizer
compton
coreutils
cower
cowsay
cronie
cryptsetup
cups-pdf
device-mapper
dhcpcd
diffutils
dmenu
docker
docker-compose
dolphin
dolphin-plugins
dosfstools
e2fsprogs
efibootmgr
emojione-color-font
escrotum-git
fakeroot
fbida
fbv
feh
ffmpeg
file
filesystem
findutils
firefox
flent
flex
foomatic-db-engine
foomatic-db-nonfree-ppds
foomatic-db-ppds
foxitreader
gawk
gcc
gcc-libs
gettext
gifsicle
gimp
git
git-lfs
glibc
gnome-keyring
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
http-parser
i3-wm
i3lock
i3status
ibus
ibus-mozc
imlib2
inetutils
inkscape
input-utils
iproute2
iputils
j4-dmenu-desktop
jdk8-openjdk
jetbrains-toolbox
jfsutils
jpegoptim
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
linux
logrotate
lshw
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
network-manager-applet
networkmanager
nfs-utils
ntfs-3g
nvidia
nvidia-settings
ocaml
openssh
os-prober
otf-ipafont
oxygen
oxygen-icons
p7zip
pacaur
pacman
patch
pavucontrol
pciutils
pcmciautils
perl
pkgconf
pkgfile
poppler
postgresql
postman
print-manager
procps-ng
psmisc
pulseaudio
pulseaudio-alsa
pwgen
python-beautifulsoup4
python-cairo
python-gobject
python-html5lib
python-pip
python-protobuf
python-webencodings
python2-virtualenv
qt4
qt5-styleplugins
qt5ct
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
selfspy-git
shadow
silver-searcher-git
slack-desktop
smartmontools
sshfs
sudo
sux
sysfsutils
system-config-printer
systemd-sysvcompat
tar
termite
testdisk
texinfo
tidy
tree
ttf-google-fonts-git
ttf-meslo
ttf-mplus
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
vegeta
vi
virtualbox
virtualbox-ext-oracle
vlc
vte3
w3m
wget
which
wrk
xautolock
xclip
xf86-video-intel
xfsprogs
xorg-xinit
xorg-xsetroot
xprintidle
youtube-dl
zathura
zip
zsh
```
